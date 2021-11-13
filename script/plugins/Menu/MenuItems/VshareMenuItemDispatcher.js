/* eslint-disable */

import AbstractMenuItemDispatcher from './AbstractMenuItemDispatcher';
import { svgIcon } from '../MDI';
import MenuItem from '../MenuItem';

const sites = { // from vshare plugin
    youtube: 'youtube\\.com/.*[&?]v=([a-z0-9_\\-]+)',
    vimeo: 'vimeo\\.com\\/(\\d+)',
    ustream: 'ustream\\.tv\\/recorded\\/(\\d+)\\/',
    '5min': '5min\\.com\\/Video/.*-([0-9]+)([&?]|$)',
    clipfish: 'clipfishi\\.de\\/.*\\/video\\/([0-9])+\\/',
    dailymotion: 'dailymotion\\.com\\/video\\/([a-z0-9]+)_',
    gtrailers: 'gametrailers\\.com\\/.*\\/(\\d+)',
    metacafe: 'metacafe\\.com\\/watch\\/(\\d+)\\/',
    myspacetv: 'vids\\.myspace\\.com\\/.*videoid=(\\d+)',
    rcmovie: 'rcmovie\\.de\\/video\\/([a-f0-9]+)\\/',
    scivee: 'scivee\\.tv\\/node\\/(\\d+)',
    twitchtv: 'twitch\\.tv\\/([a-z0-9_\\-]+)(?:\\/c\\/(\\d+))?',
    veoh: 'veoh\\.com\\/.*watch[^v]*(v[a-z0-9]+)',
    bambuser: 'bambuser\\.com\\/v\\/(\\d+)',
    bliptv: '(?:blip\\.tv\\/play\\/([a-zA-Z0-9]+\\.(?:html|x))\\?p=1|(http?\\:\\/\\/blip\\.tv\\/(?!play)(?:[a-zA-Z0-9_\\-]+)\\/(?:[a-zA-Z0-9_\\-]+)))',
    break: 'break\\.com\\/video\\/(?:(?:[a-z]+)\\/)?(?:[a-z\\-]+)-([0-9]+)',
    viddler: 'viddler\\.com\\/(?:embed|v)\\/([a-z0-9]{8})',
    msoffice: '(?:office\\.com.*[&?]videoid=([a-z0-9\\-]+))',
    msstream: 'microsoftstream\\.com\\/video\\/([a-f0-9\\-]{36})',
    slideshare: '(?:(?:slideshare\\.net\\/slideshow\\/embed_code\\/|id=)([0-9]+)|(https?\\:\\/\\/www\\.slideshare\\.net\\/(?:[a-zA-Z0-9_\\-]+)\\/(?:[a-zA-Z0-9_\\-]+)))',
    archiveorg: 'archive\\.org\\/embed\\/([a-zA-Z0-9_\\-]+)',
    niconico: 'nicovideo\\.jp/watch/(sm[0-9]+)',
    youku: 'v\\.youku\\.com/v_show/id_([0-9A-Za-z=]+)\\.html',
    tudou: 'tudou\\.com/programs/view/([0-9A-Za-z]+)',
    bilibili: 'bilibili\\.com/video/(BV[0-9A-Za-z]+)',
    bitchute: 'bitchute\\.com\\/video\\/([a-zA-Z0-9_\\-]+)',
    coub: 'coub\\.com\\/view\\/([a-zA-Z0-9_\\-]+)',
    odysee: 'odysee\\.com\\/$\\/embed\\/([-%_?=/a-zA-Z0-9]+)',
};

export default class VshareBlockMenuItemDispatcher extends AbstractMenuItemDispatcher {
    static isAvailable(schema) {
        return !!schema.nodes.dwplugin_inline;
    }

    static getMenuItem(schema) {
        if (!this.isAvailable(schema)) {
            throw new Error('Generic inline plugin nodes not available in Schema!');
        }

        return new MenuItem({
            command: (state, dispatch) => {
                const { $from } = state.selection;

                const index = $from.index();
                if (!$from.parent.canReplaceWith(index, index, schema.nodes.dwplugin_inline)) {
                    return false;
                }
                if (dispatch) {
                    let textContent = '';
                    state.selection.content().content.descendants((node) => {
                        textContent += node.textContent;
                        return false;
                    });
                    //
                    const url = prompt('Vložte prosím celý odkaz na stránku videa:');
                    const site = Object.entries(sites).find(([site, siteRegExp]) => (new RegExp(siteRegExp, 'i')).test(url));
                    if (!site) {
                        alert('Tato služba pro sdílení videí není podporována.');
                        return false;
                    }
                    const [siteKey, siteRegExp] = site;
                    const videoid = url.match(new RegExp(siteRegExp, 'i'))[1];
                    textContent = `{{${siteKey}>${videoid}}}`;
                    //

                    dispatch(state.tr.replaceSelectionWith(schema.nodes.dwplugin_inline.createChecked(
                        {},
                        schema.text(textContent),
                    )));
                }
                return true;
            },
            icon: svgIcon('video'),
            label: 'Vložit video ze stránek pro sdílení videí (např. YouTube)',
        });
    }
}
