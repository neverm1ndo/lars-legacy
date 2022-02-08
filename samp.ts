import * as dgram from 'dgram';
import { Observable, Subscriber, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

export interface ServerGameMode {
  name: string;
  mode: string;
  lang: string;
  players: {
    online: number;
    max: number;
  },
  private: boolean;
  rules?: ServerRule[];
}
interface ServerRule {
  [rule: string]: string
}

class Samp {
    debounce: number = 1000;
    constructor(debounce: number) {
      this.debounce = debounce;
    }

    getServerInfo(ip: string, port: number): Observable<ServerGameMode> {
      return of('i').pipe(mergeMap((opcode: 'i') => this.request(ip, port, opcode)));
    }

    request(ip: string, port: number, opcode: string): Observable<ServerGameMode> {
        return new Observable((sub: Subscriber<ServerGameMode>) => {
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
              socket.send(packet, 0, packet.length, port, ip);
            } catch (err) {
              console.error(err);
              sub.error(err);
            }

            let controller: NodeJS.Timeout = setTimeout(() => {
                socket.close();
                console.error(new Error(`Server ${ip}:${port} is unavalible`))
                sub.error(new Error(`Server ${ip}:${port} is unavalible`));
            }, 3000);

            socket.on('message', (message: Buffer) => {
                if (controller) clearTimeout(controller);
                if (message.length < 11) {
                    sub.error(new Error(`Invalid socket on message: ${message} > ${message.toString()}`));
                }
                else {
                    socket.close();
                    message = message.slice(11);
                    let offset: number = 0;
                    if (opcode === 'i') {
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
                        sub.next(gameModeInfo);
                        sub.complete();
                    }
                }
            });
        })
    }
}

export default Samp;
