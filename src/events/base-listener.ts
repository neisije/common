import { Message , Stan } from 'node-nats-streaming';
import { Subjects } from './subjects';

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Listener<T extends Event> {
  abstract subject: T['subject'];
  abstract onMessage(data: T['data'], msg: Message) : void;
  abstract queueGroupName: string;
  protected ackWait : number = 5 * 1000;
  protected client : Stan;

  constructor(client: Stan) {
    this.client = client;
  }

  subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      .setManualAckMode(true)
      .setDeliverAllAvailable()
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroupName);
  }

  listen() {
      const options = this.subscriptionOptions()
      const subscription = this.client.subscribe(
        this.subject, 
        this.queueGroupName, 
        this.subscriptionOptions()
      );

      subscription.on('message', (msg: Message) => {

        const parsedData = this.parseMessage(msg);
        const msgLog = JSON.stringify(parsedData);
        console.log(`Message Received (common lib): ${this.subject} : ${msgLog}`);
        this.onMessage(parsedData, msg);
      });
  }

  parseMessage(msg: Message) {
    const data = msg.getData();
    return typeof data === 'string'
      ? JSON.parse(data)
      : JSON.parse(data.toString('utf8'));
  }

}
