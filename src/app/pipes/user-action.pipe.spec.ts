import { UserActionPipe } from './user-action.pipe';

describe('UserActionPipe', () => {
  it('create an instance', () => {
    const pipe = new UserActionPipe();
    expect(pipe).toBeTruthy();
  });
});
