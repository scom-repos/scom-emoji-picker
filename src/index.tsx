import {
    customElements,
    Module,
    Styles,
    Panel,
    Input,
    GridLayout,
    VStack,
    Label,
    Control,
    Icon,
    ControlElement
} from "@ijstech/components"
import { IEmoji, IEmojiCategory } from './interface';
import { colorsMapper, emojiCategories } from "./emoji.json";
import { EmojiModel } from "./model";

interface EmojiPickerElement extends ControlElement {
    onEmojiSelected?: (value: string) => void;
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['i-scom-emoji-picker']: EmojiPickerElement;
        }
    }
}

const Theme = Styles.Theme.ThemeVars;

@customElements('i-scom-emoji-picker')
export default class EmojiPicker extends Module {
    private edtEmoji: Input;
    private gridEmojiCate: GridLayout;
    private groupEmojis: VStack;
    private pnlEmojiResult: VStack;
    private lbEmoji: Label;
    private pnlColors: Panel;
    private pnlSelectedColor: Panel;
    private recent: Panel;
    private isEmojiSearching: boolean = false;
    private recentEmojis: { [key: string]: IEmoji } = {};
    private emojiCateMapper: Map<string, VStack> = new Map();
    private searchTimeout: any;
    private emojiModel: EmojiModel;

    onEmojiSelected: (value: string) => void;

    private get hasRecentEmojis() {
        return !!Object.values(this.recentEmojis).length;
    }

    init() {
        super.init();
        this.emojiModel = new EmojiModel();
        this.onEmojiColorSelected = this.onEmojiColorSelected.bind(this);
        this.renderEmojis();
    }

    private isRecent(category: IEmojiCategory) {
        return category.value === 'recent';
    }

    private async renderEmojis() {
        this.recentEmojis = {};
        this.emojiCateMapper = new Map();
        this.renderEmojiCate();
        for (let category of emojiCategories) {
            this.renderEmojiGroup(this.groupEmojis, category);
        }
        this.renderColor(this.emojiModel.emojiColors[0]);
    }

    private async renderEmojiCate() {
        this.gridEmojiCate.clearInnerHTML();
        for (let category of emojiCategories) {
            const cateEl = (
                <i-vstack
                    id={`cate-${category.value}`}
                    overflow={'hidden'}
                    cursor='pointer'
                    opacity={0.5}
                    padding={{ top: '0.25rem', bottom: '0.25rem' }}
                    horizontalAlignment="center"
                    position='relative'
                    class="emoji-cate"
                    gap={'0.5rem'}
                    onClick={(target: Control) => this.onEmojiCateSelected(target, category)}
                >
                    <i-image
                        url={category.image}
                        width={'1.25rem'} height={'1.25rem'} display='block'
                    ></i-image>
                    <i-hstack
                        visible={false}
                        border={{ radius: '9999px' }}
                        height={'0.25rem'}
                        width={'100%'}
                        position='absolute' bottom="0px"
                        background={{ color: Theme.colors.primary.main }}
                    ></i-hstack>
                </i-vstack>
            )
            this.gridEmojiCate.appendChild(cateEl);
            this.emojiCateMapper.set(`cate-${category.value}`, cateEl);
        }
    }

    private async renderEmojiGroup(parent: Control, category: IEmojiCategory) {
        const group = (
            <i-vstack
                id={`${category.value}`}
                border={{ bottom: { width: '1px', style: 'solid', color: Theme.divider } }}
                gap="0.75rem"
                class="emoji-group"
            >
                <i-hstack
                    padding={{ top: '0.75rem', left: '0.75rem', right: '0.75rem', bottom: '0.75rem' }}
                    position="sticky" top="0px" width={'100%'} zIndex={9}
                    background={{ color: Theme.background.modal }}
                    verticalAlignment="center" horizontalAlignment="space-between"
                >
                    <i-label
                        caption={category.name}
                        font={{ size: '1.063rem', weight: 700 }}
                        wordBreak="break-word"
                    ></i-label>
                    <i-button
                        caption="Clear all"
                        font={{ size: '0.9rem', weight: 700, color: Theme.colors.primary.main }}
                        cursor='pointer'
                        boxShadow='none'
                        padding={{ left: '0.75rem', right: '0.75rem' }}
                        lineHeight={'1.25rem'}
                        border={{ radius: '9999px' }}
                        background={{ color: 'transparent' }}
                        visible={this.isRecent(category) && this.hasRecentEmojis}
                        onClick={this.onRecentClear}
                    ></i-button>
                </i-hstack>
            </i-vstack>
        )
        const itemWrap = <i-grid-layout id={`group-${category.value}`} columnsPerRow={9} padding={{ left: '0.75rem', right: '0.75rem', bottom: '0.75rem' }} />
        group.append(itemWrap);
        parent.appendChild(group);
        let data: IEmoji[] = [];
        if (this.isRecent(category)) {
            data = Object.values(this.recentEmojis);
        } else if (category.value === 'search') {
            data = this.emojiModel.searchEmojis(this.edtEmoji.value);
        } else {
            data = this.emojiModel.getEmojisByCategory(category.value);
        }
        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            itemWrap.appendChild(
                <i-panel
                    width={'1.5rem'} height={'1.5rem'}
                    cursor="pointer"
                    onClick={(target: Control, event: MouseEvent) => this.selectEmoji(event, item)}
                >
                    <i-label
                        caption={item.htmlCode.join('')}
                        display="inline-block"
                        font={{ size: '18px' }}
                    ></i-label>
                </i-panel>
            )
        }
        if (this.isRecent(category)) {
            this.recent = group;
            parent.insertAdjacentElement('afterbegin', group);
        }
    }

    private updateEmojiGroups() {
        for (let i = 1; i < emojiCategories.length; i++) {
            const category = emojiCategories[i];
            const gridElm = this.groupEmojis.querySelector(`#group-${category.value}`) as Control;
            if (!gridElm) continue;
            gridElm.clearInnerHTML();
            const data = this.emojiModel.getEmojisByCategory(category.value);
            for (let i = 0; i < data.length; i++) {
                const item = data[i];
                gridElm.appendChild(
                    <i-panel
                        width={'1.5rem'} height={'1.5rem'}
                        cursor="pointer"
                        onClick={(target: Control, event: MouseEvent) => this.selectEmoji(event, item)}
                    >
                        <i-label
                            caption={item.htmlCode.join('')}
                            display="inline-block"
                            font={{ size: '18px' }}
                        ></i-label>
                    </i-panel>
                )
            }
        }
    }

    private onRecentClear() {
        this.recentEmojis = {};
        if (this.recent) {
            this.recent.clearInnerHTML();
            this.recent = null;
        }
        if (this.gridEmojiCate?.children[1]) {
            this.onEmojiCateSelected(this.gridEmojiCate.children[1] as Control, emojiCategories[1]);
        }
    }

    private renderEmojiColors() {
        this.pnlColors.clearInnerHTML();
        for (let color of this.emojiModel.emojiColors) {
            this.renderColor(color);
        }
    }

    private renderColor(color: string) {
        const isCurrentColor = color === this.emojiModel.currentColor;
        const colorEl = (
            <i-panel
                background={{ color }}
                border={{ radius: '50%' }}
                width={'1.188rem'} height={'1.188rem'}
                padding={{ left: '0.35rem' }}
                stack={{ grow: '0', shrink: '0', basis: '1.188rem' }}
                boxShadow={`${isCurrentColor ? 'rgb(29, 155, 240) 0px 0px 0px 2px' : 'none'}`}
                onClick={this.onEmojiColorSelected}
            >
                <i-icon
                    name='check' width={'0.5rem'} height={'0.5rem'}
                    lineHeight={'0.35rem'}
                    fill={'rgb(21, 32, 43)'} visible={isCurrentColor}
                ></i-icon>
            </i-panel>
        )
        if (isCurrentColor) this.pnlSelectedColor = colorEl;
        this.pnlColors.appendChild(colorEl);
    }

    private onEmojiColorSelected(target: Control) {
        if (!this.pnlColors?.children || this.pnlColors?.children?.length < 2) {
            this.renderEmojiColors();
            return;
        }
        if (this.pnlSelectedColor) {
            this.pnlSelectedColor.boxShadow = 'none';
            const icon = this.pnlSelectedColor.querySelector('i-icon') as Icon;
            if (icon) icon.visible = false;
        }
        target.boxShadow = 'rgb(29, 155, 240) 0px 0px 0px 2px';
        const icon = target.querySelector('i-icon') as Icon;
        if (icon) icon.visible = true;
        this.pnlSelectedColor = target as Panel;
        this.emojiModel.currentColor = this.pnlSelectedColor?.background?.color;
        this.updateEmojiGroups();
    }

    private onEmojiCateSelected(target: Control, category: IEmojiCategory) {
        if (!target) return;
        const preventSelected = this.isEmojiSearching || (this.isRecent(category) && !this.recent?.children[1]?.innerHTML);
        if (preventSelected) return;
        const cates = this.querySelectorAll('.emoji-cate');
        for (let cateEl of cates) {
            (cateEl as Control).opacity = 0.5;
            (cateEl.children[1] as Control).visible = false;
        }
        (target.children[1] as Control).visible = true;
        target.opacity = 1;
        if (this.isRecent(category)) {
            this.groupEmojis.scrollTo({ top: 0 });
        } else {
            const groupEl = this.querySelector(`#${category.value}`) as Control;
            if (groupEl) {
                this.groupEmojis.scrollTo({ top: groupEl.offsetTop });
            }
        }
    }

    private async selectEmoji(event: MouseEvent, emoji: IEmoji) {
        event.stopImmediatePropagation();
        event.preventDefault();
        this.lbEmoji.caption = emoji.htmlCode.join('');
        if (this.onEmojiSelected) {
            const hexArr = emoji.unicode.map(u => parseInt(u.substring(2), 16));
            const value = String.fromCodePoint(...hexArr);
            this.onEmojiSelected(value);
        }

        this.recentEmojis[emoji.name] = emoji;
    }

    private clearSearch() {
        this.pnlEmojiResult.visible = false;
        this.groupEmojis.visible = true;
        this.edtEmoji.value = '';
        this.lbEmoji.caption = '';
        this.isEmojiSearching = false;
        if (this.hasRecentEmojis) {
            const recent = this.groupEmojis.querySelector('#recent');
            recent && this.groupEmojis.removeChild(recent);
            this.renderEmojiGroup(this.groupEmojis, emojiCategories[0]);
        } else if (this.recent) {
            this.recent.clearInnerHTML();
        }
        const index = this.hasRecentEmojis ? 0 : 1;
        if (this.gridEmojiCate?.children?.length) {
            this.onEmojiCateSelected(this.gridEmojiCate.children[index] as Control, emojiCategories[index]);
        }
        this.pnlColors.clearInnerHTML();
        this.renderColor(this.emojiModel.currentColor);
    }

    private async onEmojiSearch() {
        if (this.searchTimeout) clearTimeout(this.searchTimeout);
        if (!this.edtEmoji.value) {
            this.clearSearch();
        } else {
            this.pnlEmojiResult.visible = true;
            this.groupEmojis.visible = false;
            this.pnlEmojiResult.clearInnerHTML();
            this.searchTimeout = setTimeout(() => {
                const category = {
                    name: 'Search results',
                    value: 'search'
                }
                this.renderEmojiGroup(this.pnlEmojiResult, category);
            }, 100)
            this.isEmojiSearching = true;
        }
    }

    onEmojiPickerClick(target: Control, event: Event) {
        event.stopPropagation();
    }

    render() {
        return (
            <i-vstack position='relative' onClick={this.onEmojiPickerClick}>
                <i-vstack padding={{ left: '0.25rem', right: '0.25rem' }}>
                    <i-hstack
                        verticalAlignment="center"
                        border={{ radius: '9999px', width: '1px', style: 'solid', color: Theme.divider }}
                        minHeight={40} width={'100%'}
                        background={{ color: Theme.input.background }}
                        padding={{ left: '0.75rem', right: '0.75rem' }}
                        margin={{ top: '0.25rem', bottom: '0.25rem' }}
                        gap="4px"
                    >
                        <i-icon width={'1rem'} height={'1rem'} name='search' fill={Theme.text.secondary} />
                        <i-input
                            id="edtEmoji"
                            placeholder='Search emojis'
                            width='100%'
                            height='100%'
                            border={{ style: 'none' }}
                            captionWidth={'0px'}
                            showClearButton={true}
                            onClearClick={this.clearSearch}
                            onKeyUp={this.onEmojiSearch}
                        ></i-input>
                    </i-hstack>
                </i-vstack>
                <i-grid-layout
                    id="gridEmojiCate"
                    verticalAlignment="center"
                    columnsPerRow={9}
                    margin={{ top: 4 }}
                    grid={{ verticalAlignment: 'center', horizontalAlignment: 'center' }}
                    border={{ bottom: { width: '1px', style: 'solid', color: Theme.divider } }}
                ></i-grid-layout>
                <i-vstack id="groupEmojis" maxHeight={300} overflow={{ y: 'auto' }} />
                <i-vstack
                    id="pnlEmojiResult"
                    border={{ bottom: { width: '1px', style: 'solid', color: Theme.divider } }}
                    maxHeight={300} overflow={{ y: 'auto' }}
                    minHeight={200}
                    gap="0.75rem"
                    visible={false}
                />
                <i-hstack
                    position="relative" width={'100%'}
                    verticalAlignment="center" horizontalAlignment="space-between"
                    padding={{ top: '0.75rem', left: '0.75rem', right: '0.75rem', bottom: '0.75rem' }}
                    gap="0.75rem"
                    background={{ color: Theme.background.modal }}
                    border={{ radius: '0 0 1rem 1rem', top: { width: '1px', style: 'solid', color: Theme.divider } }}
                >
                    <i-label id="lbEmoji" width={'1.25rem'} height={'1.25rem'} display="inline-block"></i-label>
                    <i-hstack
                        id="pnlColors"
                        verticalAlignment="center" gap={'0.25rem'}
                        overflow={'hidden'}
                        cursor="pointer"
                        padding={{ top: '0.25rem', left: '0.25rem', right: '0.25rem', bottom: '0.25rem' }}
                    />
                </i-hstack>
            </i-vstack>
        )
    }
}