import { h, Component } from 'preact';
import {botman} from './../botman';
import MessageType from "./messagetype";
import { IMessageTypeProps, IAction, IMessage } from '../../typings';

export default class Action extends MessageType {

    render(props: IMessageTypeProps) {
        const message = props.message;

        const buttons = message.actions.map((action: IAction) => {
            return <div class="btn" onClick={() => this.performAction(action)}>
                {action.text}
            </div>;
        });

        return (
            <div class="actions">
                {message.text && <div>{message.text}</div>}
                {this.state.attachmentsVisible ?
                    <div class="button-actions">{buttons}</div>
                    : ''}
            </div>
        );
    }

    performAction(action: IAction) {
        botman.callAPI(action.value, true, null, (msg: IMessage) => {

            let jsonMessage =JSON.parse( JSON.stringify(msg));
            console.log("aquii esta el message ",jsonMessage.callback_id);
            this.setState({ attachmentsVisible: false });
            
            let type = msg.type;
            console.log("asdfasdf asd dada--",msg);
            if (jsonMessage.callback_id!= "do_you_want") {
                this.props.messageHandler({
                    text: action.text,
                    type: "text",
                    timeout: msg.timeout,
                    actions: [],
                    attachment:null,
                    additionalParameters: null,
                    from: 'visitor'
                });
            }

            if (jsonMessage.callback_id== "do_you_want") {
                 setTimeout(() => {
                      this.props.messageHandler({
                        text: msg.text,
                        type: msg.type,
                        timeout: msg.timeout,
                        actions: msg.actions,
                        attachment: msg.attachment,
                        additionalParameters: msg.additionalParameters,
                        from: 'chatbot'
                    });
                }, 2000);
            } else {
                this.props.messageHandler({
                    text: msg.text,
                    type: msg.type,
                    timeout: msg.timeout,
                    actions: msg.actions,
                    attachment: msg.attachment,
                    additionalParameters: msg.additionalParameters,
                    from: 'chatbot'
                });
            }
          

           
        }, null);
    }
}
