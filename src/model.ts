import { emojis, emojiCategories, colorsMapper } from './emoji.json';
import { IEmoji } from './interface';

export class EmojiModel {
    private emojiCategoryMap: Record<string, IEmoji[]> = {};
    private _currentColor: string = this.emojiColors[0];

    get currentColor() {
        return this._currentColor;
    }

    set currentColor(value: string) {
        this._currentColor = value;
    }

    get emojiColors() {
        return Object.keys(colorsMapper);
    }

    private filterEmojiByColor(data: IEmoji[]) {
        if (!data || !data.length) return [];
        const colorHtmlCode = colorsMapper[this.currentColor].htmlCode;
        if (colorHtmlCode) {
            return data.filter(emoji => emoji.htmlCode.includes(colorHtmlCode));
        } else {
            return data.filter(emoji => !emoji.name.includes(' type-'));
        }
    }

    getEmojisByCategory(category: string): IEmoji[] {
        if (!this.emojiCategoryMap[category]) {
            category = category.replace(/-/g, ' ');
            this.emojiCategoryMap[category] = emojis.filter(emoji => emoji.category === category);
        }
        const data = this.emojiCategoryMap[category];
        return this.filterEmojiByColor(data);
    }

    searchEmojis(value: string): IEmoji[] {
        const keyword = value.toLowerCase();
        const categoryName = emojiCategories.find(cate => cate.name.toLowerCase().includes(keyword))?.name;
        let data: IEmoji[];
        if (categoryName) {
            data = this.emojiCategoryMap[categoryName];
        } else {
            data = emojis.filter(emoji => emoji.name.includes(keyword));
        }
        return this.filterEmojiByColor(data);
    }
}