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