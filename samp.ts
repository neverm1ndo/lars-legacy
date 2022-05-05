import * as dgram from 'dgram';

export interface ServerGameMode {
  name: string;
  mode: string;
  lang: string;
  players: {
    online: number;
    max: number;
  },
  private: boolean;
  rules?: ServerRules;
  playersList?: ServerPlayer[];
}
interface ServerRules {
  [rule: string]: string
}
interface ServerPlayer {
  id: number;
  name: string;
  score: number;
  ping: number;
}

enum Opcode {
  D = 'd',
  R = 'r',
  I = 'i',
}

class Samp {

  private _debounce: number = 1000;

  constructor(debounce: number) {
    this._debounce = debounce;
  }

  public async getServerInfo(ip: string, port: number): Promise<ServerGameMode> {
    return Promise.all(
      [Opcode.I, Opcode.R, Opcode.D].map(async (res: Opcode) => await this._request(ip, port, res))
    ).then(([gameMode, rules, playersList]) => {
      let info: ServerGameMode = gameMode;
          info.rules = rules,
          info.playersList = playersList;
      return Promise.resolve(info);
    }).catch((err) => {
      return Promise.reject(err);
    });
  }

  private _request(ip: string, port: number, opcode: Opcode): Promise<any> {
    return new Promise((resolve, reject) => {
      const socket = dgram.createSocket("udp4");
      let packet: Buffer = Buffer.alloc(10 + opcode.length);

      packet.write('SAMP');
      packet[4] = Number(ip.split('.')[0]);
      packet[5] = Number(ip.split('.')[1]);
      packet[6] = Number(ip.split('.')[2]);
      packet[7] = Number(ip.split('.')[3]);
      packet[8] = port & 0xFF;
      packet[9] = port >> 8 & 0xFF;
      packet[10] = opcode.charCodeAt(0);

      try {
        console.info('Sending packet: ', packet);
        socket.send(packet, 0, packet.length, port, ip);
      } catch (err) {
        console.error(err);
        reject(err);
      }

      let controller: NodeJS.Timeout = setTimeout(() => {
        socket.close();
        console.error(new Error(`Server ${ip}:${port} is unavalible`))
        reject(new Error(`Server ${ip}:${port} is unavalible`));
      }, this._debounce);

      socket.on('message', (message: Buffer) => {
        if (controller) clearTimeout(controller);
        if (message.length < 11) {
          reject(new Error(`Invalid socket on message: ${message} > ${message.toString()}`));
        }
        else {
          socket.close();
          message = message.slice(11);
          let offset: number = 0;
          if (opcode === Opcode.I) {
            const gameModeInfo: ServerGameMode = {
              private: !!message.readUInt8(offset),
              players: {
                online: message.readUInt16LE(offset += 1),
                max:  message.readUInt16LE(offset += 2),
              },
              name: ((): string => {
                const name = message.readUInt16LE(offset += 2);
                return String(message.slice(offset += 4, offset += name));
              })(),
              mode: String(message.slice(offset += 4, offset += message.readUInt16LE(offset - 4))),
              lang: String(message.slice(offset += 4, offset += message.readUInt16LE(offset - 4))),
            }
            resolve(gameModeInfo);
          } else if (opcode === Opcode.R) {
              offset += 2;
              const rules: ServerRules = [
                  ...new Array(message.readUInt16LE(offset - 2))
                      .fill({})
              ].map(() => {
                  let property: string = (() => {
                    let prop = message.readUInt8(offset);
                    return message.slice(++offset, offset += prop).toString();
                  })();

                  let propertyvalue: string = (() => {
                    let val = message.readUInt8(offset);
                    return message.slice(++offset, offset += val).toString();
                  })();

                  return { [property]: propertyvalue }
              }).reduce((acc: ServerRules, curr: ServerRules) => {
                return Object.assign(acc, curr);
              }, {});
              resolve(rules);
          } else if (opcode === Opcode.D) {
            offset += 2;
            const object = [
                ...new Array(Math.floor(message.readUInt16LE(offset - 2)))
                    .fill({})
            ].map(() => {
                const id: number = message.readUInt8(offset);

                let name: string = (() => {
                  let name = message.readUInt8(++offset);
                  return message.slice(++offset, offset += name).toString();
                })();

                const score: number = message.readUInt16LE(offset);
                const ping: number = message.readUInt16LE(offset += 4);

                offset += 4;
                return { id, name, score, ping };
            });
            resolve(object);
          }
        }
      });
    });
  }
}

export default Samp;
