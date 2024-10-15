import { customModule, Input, Module } from '@ijstech/components';
import EmojiPicker from '@scom/scom-emoji-picker';

@customModule
export default class Module1 extends Module {
    private edtEmoji: Input;
    private emojiPicker: EmojiPicker;

    private async handleSelectedEmoji(value: string) {
        this.edtEmoji.value = this.edtEmoji.value + value;
    }

    render() {
        return (
            <i-stack
                direction="vertical"
                margin={{ top: '1rem', left: '1rem', right: '1rem' }}
                gap="1rem"
            >
                <i-input id="edtEmoji" width="100%" inputType='textarea' rows={4}></i-input>
                <i-scom-emoji-picker id="emojiPicker" onEmojiSelected={this.handleSelectedEmoji}></i-scom-emoji-picker>
            </i-stack>
        )
    }
}