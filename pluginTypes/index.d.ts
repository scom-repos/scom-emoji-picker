/// <amd-module name="@scom/scom-emoji-picker/interface.ts" />
declare module "@scom/scom-emoji-picker/interface.ts" {
    export interface IEmojiCategory {
        name: string;
        value: string;
        image?: string;
        groups?: string[];
    }
    export interface IEmoji {
        name: string;
        category: string;
        group: string;
        htmlCode: string[];
        unicode: string[];
    }
}
/// <amd-module name="@scom/scom-emoji-picker/emoji.json.ts" />
declare module "@scom/scom-emoji-picker/emoji.json.ts" {
    export const emojiCategories: {
        name: string;
        value: string;
        image: string;
        groups: string[];
    }[];
    export const emojis: {
        name: string;
        category: string;
        group: string;
        htmlCode: string[];
        unicode: string[];
    }[];
    export const colorsMapper: {
        'rgb(255, 220, 93)': {
            htmlCode: string;
            unicode: string;
        };
        'rgb(247, 222, 206)': {
            htmlCode: string;
            unicode: string;
        };
        'rgb(243, 210, 162)': {
            htmlCode: string;
            unicode: string;
        };
        'rgb(213, 171, 136)': {
            htmlCode: string;
            unicode: string;
        };
        'rgb(175, 126, 87)': {
            htmlCode: string;
            unicode: string;
        };
        'rgb(124, 83, 62)': {
            htmlCode: string;
            unicode: string;
        };
    };
}
/// <amd-module name="@scom/scom-emoji-picker/model.ts" />
declare module "@scom/scom-emoji-picker/model.ts" {
    import { IEmoji } from "@scom/scom-emoji-picker/interface.ts";
    export class EmojiModel {
        private emojiCategoryMap;
        private _currentColor;
        get currentColor(): string;
        set currentColor(value: string);
        get emojiColors(): string[];
        private filterEmojiByColor;
        getEmojisByCategory(category: string): IEmoji[];
        searchEmojis(value: string): IEmoji[];
    }
}
/// <amd-module name="@scom/scom-emoji-picker/translations.json.ts" />
declare module "@scom/scom-emoji-picker/translations.json.ts" {
    const _default: {
        en: {
            activities: string;
            animals_and_nature: string;
            clear_all: string;
            flags: string;
            food_and_drink: string;
            objects: string;
            recent: string;
            search_emoji: string;
            search_results: string;
            smileys_and_emotion: string;
            smileys_and_people: string;
            symbols: string;
            travel_and_places: string;
        };
        "zh-hant": {
            activities: string;
            animals_and_nature: string;
            clear_all: string;
            flags: string;
            food_and_drink: string;
            objects: string;
            recent: string;
            search_emoji: string;
            search_results: string;
            smileys_and_emotion: string;
            smileys_and_people: string;
            symbols: string;
            travel_and_places: string;
        };
        vi: {
            activities: string;
            animals_and_nature: string;
            clear_all: string;
            flags: string;
            food_and_drink: string;
            objects: string;
            recent: string;
            search_emoji: string;
            search_results: string;
            smileys_and_emotion: string;
            smileys_and_people: string;
            symbols: string;
            travel_and_places: string;
        };
    };
    export default _default;
}
/// <amd-module name="@scom/scom-emoji-picker" />
declare module "@scom/scom-emoji-picker" {
    import { Module, Control, ControlElement } from "@ijstech/components";
    interface EmojiPickerElement extends ControlElement {
        onEmojiSelected?: (value: string) => void;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-scom-emoji-picker']: EmojiPickerElement;
            }
        }
    }
    export default class EmojiPicker extends Module {
        private edtEmoji;
        private gridEmojiCate;
        private groupEmojis;
        private pnlEmojiResult;
        private lbEmoji;
        private pnlColors;
        private pnlSelectedColor;
        private recent;
        private isEmojiSearching;
        private recentEmojis;
        private emojiCateMapper;
        private searchTimeout;
        private emojiModel;
        onEmojiSelected: (value: string) => void;
        private get hasRecentEmojis();
        init(): void;
        private isRecent;
        private renderEmojis;
        private renderEmojiCate;
        private renderEmojiGroup;
        private updateEmojiGroups;
        private onRecentClear;
        private renderEmojiColors;
        private renderColor;
        private onEmojiColorSelected;
        private onEmojiCateSelected;
        private selectEmoji;
        clearSearch(): void;
        private onEmojiSearch;
        onEmojiPickerClick(target: Control, event: Event): void;
        render(): any;
    }
}
