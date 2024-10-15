import { customModule, Module } from '@ijstech/components';
import EmojiPicker from '@scom/scom-emoji-picker';

@customModule
export default class Module1 extends Module {
    private emojiPicker: EmojiPicker;

    render() {
        return (
            <i-stack
                direction="vertical"
                margin={{ top: '1rem', left: '1rem', right: '1rem' }}
                gap="1rem"
            >
                <i-scom-emoji-picker id="emojiPicker"></i-scom-emoji-picker>
            </i-stack>
        )
    }
}