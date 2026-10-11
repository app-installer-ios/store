// Конфигурация Supabase
const SUPABASE_URL = "https://gbuvpqcummyutycemaaj.supabase.co";
const SUPABASE_KEY = "sb_publishable_oUDovfvWL6iioG6N5Xd_QQ_8KYezq8g";
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Глобальные переменные
let remoteConfig = { sitePassword: "", appPasswords: {}, appVisibility: {} };
let selectedAppUrl = "";
let selectedAppKey = "";
let currentCategory = "all";
let isSheetClosing = false;
let currentToken = null;

// База данных всех приложений сайта
// Если нужно добавить новое приложение — просто добавьте его сюда, HTML обновится сам!
const appsData = [
    { key: "vk", name: "ВКонтакте", category: "social", url: "https://app-installer-ios.github.io/store/manifests/vk.plist", icon: "https://i.pinimg.com/736x/92/a9/dc/92a9dc918ad00d529922958f603ede6d.jpg", ios: "iOS 17.6+" },
    { key: "max", name: "MAX", category: "social", url: "https://app-installer-ios.github.io/store/manifests/max.plist", icon: "https://mari-el.gov.ru/upload/iblock/ff2/wiu6p92d5b9r5t9cr4tvv8dwbt3iwiej.png", ios: "iOS 15.5+" },
    { key: "vk-video", name: "VK Видео", category: "social", url: "https://app-installer-ios.github.io/store/manifests/vk-video.plist", icon: "https://cdn.shazoo.ru/c1240x645/866526_IsBrEl5_vk.jpg", ios: "iOS 17.6+" },
    { key: "vk-clips", name: "VK Клипы", category: "social", url: "https://app-installer-ios.github.io/store/manifests/vk-clips.plist", icon: "https://freesoft.ru/storage/images/759/7588/758713/758713_normal.png", ios: "iOS 14.0+" },
    { key: "vk_massanger", name: "VK Мессенджер", category: "social", url: "https://app-installer-ios.github.io/store/manifests/vk_massanger.plist", icon: "https://www.iguides.ru/upload/iblock/210/s94o3au4qff3sawwq34yksmr7ux2qi8i.jpeg", ios: "iOS 15.0+" },
    { key: "vkmusic", name: "VK Музыка", category: "social", url: "https://app-installer-ios.github.io/store/manifests/vkmusic.plist", icon: "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/4f/e6/c2/4fe6c2fd-782e-6c4b-0ded-1f18e7a436a0/Placeholder.mill/1200x630wa.jpg", ios: "iOS 15.0+" },
    { key: "sberfinansy", name: "СберБанк (Финансы Онлайн)", category: "banks", url: "https://app-installer-ios.github.io/store/manifests/sberfinansy.plist", icon: "https://avatars.mds.yandex.net/i?id=e136f957340f46f667209074aaded2ae_l-4079503-images-thumbs&n=13", ios: "iOS 15.0+" },
    { key: "avito", name: "Авито", category: "other", url: "https://app-installer-ios.github.io/store/manifests/avito.plist", icon: "https://images.meme-arsenal.com/831d76849c248c4785c163219dda744b.jpg", ios: "iOS 16.0+" },
    { key: "sovkombank-vsekarty", name: "Совкомбанк (Все карты MDS)", category: "banks", url: "https://app-installer-ios.github.io/store/manifests/sovkombank-vsekarty.plist", icon: "https://github.com/app-installer-ios/store/releases/download/Sovkom-SCBNotes/2026-10-10_22-44-26.png", ios: "iOS 17.0+" },
    { key: "tbank", name: "Т-Банк (8PRO)", category: "banks", url: "https://app-installer-ios.github.io/store/manifests/tbank.plist", icon: "https://static6.tgstat.ru/channels/_50/cc/ccbdee27cc3ba4234ebf990580c1e00f.jpg", ios: "iOS 16.0+" },
    { key: "sovkombank-sinoptik", name: "Совкомбанк (Синоптик+)", category: "banks", url: "https://app-installer-ios.github.io/store/manifests/sovkombank-sinoptik.plist", icon: "https://github.com/app-installer-ios/store/releases/download/Sovkom-SCBNotes/2026-10-10_22-44-26.png", ios: "iOS 17.0+" },
    { key: "spotluma", name: "Т-Банк (Spotluma)", category: "banks", url: "https://app-installer-ios.github.io/store/manifests/spotluma.plist", icon: "https://static6.tgstat.ru/channels/_50/cc/ccbdee27cc3ba4234ebf990580c1e00f.jpg", ios: "iOS 16.0+" },
    { key: "lenta", name: "Лента", category: "other", url: "https://app-installer-ios.github.io/store/manifests/lenta.plist", icon: "https://i.taplink.st/a/1/4/7/e/15bb4a.jpg?139", ios: "iOS 16.0+" },
    { key: "yandex-pay", name: "Яндекс Пэй", category: "banks", url: "https://app-installer-ios.github.io/store/manifests/yandex-pay.plist", icon: "https://avatars.mds.yandex.net/get-altay/16329243/2a0000019bc0e7a55b0eaa0dcc6b77eca410/XL", ios: "iOS 16.0+" },
    { key: "2gis", name: "2ГИС", category: "other", url: "https://app-installer-ios.github.io/store/manifests/2gis.plist", icon: "https://avatars.mds.yandex.net/i?id=55fe61e4c88acc4ce04bdd4b010fe649cecd5944-5233671-images-thumbs&n=13", ios: "iOS 16.0+" },
    { key: "yla", name: "Юла", category: "other", url: "https://app-installer-ios.github.io/store/manifests/yla.plist", icon: "https://avatars.mds.yandex.net/i?id=de2c57353882125853f6d024be2789d7_l-5209452-images-thumbs&n=13", ios: "iOS 15.6+" },
    { key: "psb", name: "ПСБ (Чайная Церемония)", category: "banks", url: "https://app-installer-ios.github.io/store/manifests/psb.plist", icon: "https://avatars.mds.yandex.net/i?id=8ee36645ffa71da6eb92a8fe9278eca3_l-5358567-images-thumbs&n=13", ios: "iOS 15.0+" },
    { key: "kuper", name: "Купер", category: "other", url: "https://app-installer-ios.github.io/store/manifests/kuper.plist", icon: "https://60.img.avito.st/image/1/1.0dwn5ba1fTU9QtMzCbrPvnxEfzWZTtMzPUJ_Nw.j26nxCmZQ8VWkUMP7X-DLKRbPztCEmtRQ9pGUH_DqPY", ios: "iOS 15.0+" },
    { key: "rutube", name: "Rutube", category: "social", url: "https://app-installer-ios.github.io/store/manifests/rutube.plist", icon: "https://azecsuwvwypwnkgobujn.supabase.co/storage/v1/object/public/avatars/company-logos/b341fde4-0bb0-4361-8104-81c7a384f66f.png", ios: "iOS 16.0+" },
    { key: "mobio", name: "СберМобайл (Мобио)", category: "other", url: "https://app-installer-ios.github.io/store/manifests/mobio.plist", icon: "https://web.archive.org/web/20230220074655im_/https://sbermobile.ru/favicons/ICON_sbermobile-long.jpg?v=2", ios: "iOS 15.0+" },
    { key: "tmobail", name: "Т-Мобайл", category: "other", url: "https://app-installer-ios.github.io/store/manifests/tinkoffmobail.plist", icon: "https://github.com/app-installer-ios/store/releases/download/tinkoffmobail/2026-10-10_22-42-15.png", ios: "iOS 16.0+" },
    { key: "ubrir-rubli", name: "УБРиР (РУбли)", category: "banks", url: "https://app-installer-ios.github.io/store/manifests/ubrir_rubli.plist", icon: "https://banki.loans/storage/posts/June2021/2NH4l0w4DiKbR77CudHS.png", ios: "iOS 15.0+" },
    { key: "sberkids", name: "СберKids (SpeakaBoo)", category: "banks", url: "https://app-installer-ios.github.io/store/manifests/sberkids.plist", icon: "https://avatars.mds.yandex.net/i?id=b6df7c45dd50f80955f038e2372136cf_l-5339410-images-thumbs&n=13", ios: "iOS 15.0+" },
    { key: "lentaa", name: "Лента (Быстро Продукты)", category: "other", url: "https://app-installer-ios.github.io/store/manifests/lentaa.plist", icon: "https://i.taplink.st/a/1/4/7/e/15bb4a.jpg?139", ios: "iOS 16.0+" },
    { key: "avito-anero", name: "Авито (Anero)", category: "other", url: "https://app-installer-ios.github.io/store/manifests/avito-anero.plist", icon: "https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/7e/28/f6/7e28f600-04c2-5f88-51ea-5f0a866da9f6/AppIcon-0-0-1x_U007epad-0-1-85-220.png/1200x1200bb.png", ios: "iOS 16.0+" },
    { key: "craftersy", name: "Т-Банк (Craftersy)", category: "banks", url: "https://app-installer-ios.github.io/store/manifests/craftersy.plist", icon: "https://static6.tgstat.ru/channels/_50/cc/ccbdee27cc3ba4234ebf990580c1e00f.jpg", ios: "iOS 16.0+" },
    { key: "scbnotes", name: "СовкомБанк (SCB Notes)", category: "banks", url: "https://app-installer-ios.github.io/store/manifests/scbnotes.plist", icon: "https://github.com/app-installer-ios/store/releases/download/Sovkom-SCBNotes/2026-10-10_22-44-26.png", ios: "iOS 17.0+" },
    { key: "ak-bars-bank", name: "АК Барс (Всё Учтено)", category: "banks", url: "https://app-installer-ios.github.io/store/manifests/ak-bars-bank.plist", icon: "https://static.tildacdn.com/tild6335-3234-4462-b262-303937366262/__.jpg", ios: "iOS 16.0+" },
    { key: "blum", name: "РокетБанк (Блум)", category: "banks", url: "https://app-installer-ios.github.io/store/manifests/blum.plist", icon: "https://images.meme-arsenal.com/b4a2cd0fa9f128945deb4b6a2da30829.jpg", ios: "iOS 15.0+" },
    { key: "happ_proxy", name: "Happ Proxy", category: "other", url: "https://app-installer-ios.github.io/store/manifests/happ.plist", icon: "https://www.anti-malware.ru/files/images/source/happisback-news.png", ios: "iOS 15.0+" },
    { key: "chatgpt", name: "ChatGPT", category: "other", url: "https://app-installer-ios.github.io/store/manifests/chatgpt.plist", icon: "https://i.kod.ru/unsafe/rs:fill:1200:630:1/q:85/plain/https%3A%2F%2Fapi.kod.ru%2Fcontent%2Fimages%2F2026%2F03%2FIMG_3113-1.webp", ios: "iOS 16.0+" },
    { key: "gemini", name: "Google Gemini", category: "other", url: "https://app-installer-ios.github.io/store/manifests/gemini.plist", icon: "https://github.com/app-installer-ios/store/releases/download/gemini/geminilogo.png", ios: "iOS 14.0+" },
    { key: "lenta_lesenta", name: "Лента (Лесента)", category: "other", url: "https://app-installer-ios.github.io/store/manifests/lenta_lesenta.plist", icon: "https://github.com/app-installer-ios/store/releases/download/lenta_lesenta/IconLesenta.png", ios: "iOS 15.0+" },
    { key: "sber_invest", name: "СберИнвестиции", category: "investments", url: "https://app-installer-ios.github.io/store/manifests/sberinvest_siyanie.plist", icon: "https://play-lh.googleusercontent.com/TKVuldWCwCwV4fawNUHEYp_ugy5e8tYw54Mogl3YbVBNcb6GPJ3eBLshXQ4tBv9zdA", ios: "iOS 15.0+" },
    { key: "vtb_invest", name: "ВТБ Инвестиции", category: "investments", url: "https://app-installer-ios.github.io/store/manifests/vtbinvest_kafario.plist", icon: "https://avatars.mds.yandex.net/i?id=dad679c9a9151f179f35c091b379f63ddde52982-4575475-images-thumbs&n=13", ios: "iOS 15.0+" },
    { key: "alfa_invest", name: "Альфа Инвестиции", category: "investments", url: "https://app-installer-ios.github.io/store/manifests/alfa_invest.plist", icon: "https://is1-ssl.mzstatic.com/image/thumb/Purple126/v4/b5/17/f5/b517f516-37e2-8193-f5e3-f32448070520/AppIcon-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/1200x630wa.png", ios: "iOS 16.0+" },
    { key: "sbpay", name: "СБПэй", category: "other", url: "https://app-installer-ios.github.io/store/manifests/sbpay.plist", icon: "https://avatars.mds.yandex.net/i?id=7680b326d267d36c98347f09c4968699_l-5662910-images-thumbs&n=13", ios: "iOS 13.0+" },
    { key: "yota_atoy", name: "YOTA (Atoy)", category: "other", url: "https://app-installer-ios.github.io/store/manifests/yota_atoy.plist", icon: "https://cdn1.ozonusercontent.com/s3/product-service-meta-media/c63bbaf2-9af4-47dd-a5c8-a6aba2540d43.jpg", ios: "iOS 15.0+" },
    { key: "gazpromneft", name: "Газпромнефть", category: "other", url: "https://app-installer-ios.github.io/store/manifests/gazpromneft.plist", icon: "https://avatars.mds.yandex.net/i?id=f5b78015f371133a357d570c8857c46db5324c27-8343045-images-thumbs&n=13", ios: "iOS 15.0+" },
    { key: "novikombank", name: "Новикомбанк", category: "banks", url: "https://app-installer-ios.github.io/store/manifests/novikombank.plist", icon: "https://s.rbk.ru/v1_companies_s3/media/trademarks/e0275264-62c2-41fb-a7be-963c06ffc091.jpg", ios: "iOS 12.0+" },
    { key: "rshb_gysi", name: "РСХБ (Любовь и гуси)", category: "banks", url: "https://app-installer-ios.github.io/store/manifests/rshb_gysi.plist", icon: "https://static.rustore.ru/imgproxy/a-_4wihi7Ipu_Q1vKfwQL60cBsrs33Zb4WNSoTBVFmc/preset:vk_og_img/plain/https://static.rustore.ru/9462ebde-9163-4ec9-bfe6-556c23a9cbaf@webp", ios: "iOS 15.0+" },
    { key: "mtsdengi", name: "МТС Банк", category: "banks", url: "https://app-installer-ios.github.io/store/manifests/mtsdengi.plist", icon: "https://yt3.googleusercontent.com/ni-yGWFO4YJzf02xm8UL9N_WReTfYAN6sIj0wtyoaLD16D8MUPaiuGp0So8ZYGw1ApRXw0wzW4w=s900-c-k-c0x00ffffff-no-rj", ios: "iOS 15.0+" }
];

// Генерация HTML списка приложений (отрабатывает при старте)
function generateAppsHTML() {
    const container = document.getElementById("appListContainer");
    if (!container) return;
    
    let html = "";
    appsData.forEach(app => {
        // Добавлен loading="lazy" для оптимизации картинок
        html += `
        <div class="sheet-item" data-key="${app.key}" data-category="${app.category}" onclick="selectApp(this, 'itms-services://?action=download-manifest&url=${app.url}', '${app.name}', '${app.key}')">
            <div class="sheet-item-main">
                <div class="app-icon"><img loading="lazy" src="${app.icon}" alt="${app.name}"></div>
                <div class="sheet-info-box"><span class="app-name">${app.name}</span></div>
            </div>
            <span class="ios-badge">${app.ios}</span>
        </div>`;
    });
    
    container.innerHTML = html;
}


async function checkSiteStatus() {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/site_status?select=is_enabled&id=eq.1&limit=1`, {
            headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` },
            cache: "no-store"
        });
        if (!response.ok) throw new Error("Не удалось проверить статус");
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
            return data[0].is_enabled;
        }
    } catch (e) {
        console.error("Ошибка проверки статуса:", e);
    }
    return true;
}

async function checkSiteStatusManual() {
    const btn = document.getElementById("checkStatusBtn");
    if (btn) {
        btn.style.opacity = "0.7";
        btn.textContent = "Проверка...";
    }

    const isEnabled = await checkSiteStatus();
    if (isEnabled) {
        location.reload();
    } else if (btn) {
        btn.style.opacity = "1";
        btn.textContent = "Проверить снова";
    }
}

async function fetchSupabaseSettings() {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/settings?select=*`, {
            headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` },
            cache: "no-store"
        });
        if (!response.ok) throw new Error("Ошибка загрузки");
        const data = await response.json();
        
        const config = { sitePassword: "", appPasswords: {}, appVisibility: {} };

        data.forEach(item => {
            if (!item || !item.key) return;
            if (item.key === 'site_password') {
                config.sitePassword = item.value;
            } else if (item.key.startsWith('vis_')) {
                config.appVisibility[item.key.replace('vis_', '')] = item.value === 'true';
            } else if (item.key.startsWith('pass_')) {
                config.appPasswords[item.key.replace('pass_', '')] = item.value;
            } else {
                config.appPasswords[item.key] = item.value;
            }
        });
        return config;
    } catch (e) {
        console.error("Ошибка настроек:", e);
        return { sitePassword: "", appPasswords: {}, appVisibility: {} };
    }
}

function getAppPasswords() { return remoteConfig.appPasswords; }
function getSitePassword() { return remoteConfig.sitePassword; }

function applyAppsVisibility() {
    document.querySelectorAll('.sheet-list .sheet-item').forEach(item => {
        const key = item.getAttribute('data-key');
        const isVisible = remoteConfig.appVisibility[key] !== false;
        item.setAttribute('data-visible', isVisible ? 'true' : 'false');
    });
}

function switchScreen(screenId) {
    document.querySelectorAll(".container").forEach(el => el.classList.remove("active-screen"));
    const target = document.getElementById(screenId);
    if (target) target.classList.add("active-screen");
}

function updateAppCounter(count) {
    let visibleApps = typeof count === 'number' ? count : Array.from(document.querySelectorAll('.sheet-list .sheet-item')).filter(item => {
        return item.getAttribute('data-visible') !== 'false' && getComputedStyle(item).display !== 'none';
    }).length;

    const counterElement = document.getElementById('app-counter-text');
    if (counterElement) {
        let word = 'приложений';
        const lastDigit = visibleApps % 10;
        const lastTwoDigits = visibleApps % 100;

        if (lastTwoDigits < 11 || lastTwoDigits > 14) {
            if (lastDigit === 1) word = 'приложение';
            else if (lastDigit >= 2 && lastDigit <= 4) word = 'приложения';
        }

        counterElement.textContent = `Все ${visibleApps} ${word}`;
    }
}

// Вызываем генерацию HTML списка ДО подгрузки данных
generateAppsHTML();

document.addEventListener("DOMContentLoaded", async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
        currentToken = token;
        await handleOneTimeToken(token);
        return; 
    }

    const isSiteEnabled = await checkSiteStatus();
    if (!isSiteEnabled) {
        switchScreen("maintenanceApp");
        return;
    }

    remoteConfig = await fetchSupabaseSettings();
    applyAppsVisibility();

    if (sessionStorage.getItem("site_access") === "true") {
        switchScreen("mainApp");
    } else {
        switchScreen("authApp");
    }

    filterApps();

    supabaseClient
        .channel('public:site_status')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'site_status' }, payload => {
            if (new URLSearchParams(window.location.search).get('token')) return;

            if (payload.new && typeof payload.new.is_enabled !== 'undefined') {
                if (payload.new.is_enabled === false) {
                    switchScreen("maintenanceApp");
                } else {
                    location.reload();
                }
            }
        })
        .subscribe();

    supabaseClient
        .channel('public:settings')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'settings' }, async () => {
            if (new URLSearchParams(window.location.search).get('token')) return;

            const previousSitePassword = remoteConfig.sitePassword;
            remoteConfig = await fetchSupabaseSettings();

            if (previousSitePassword && previousSitePassword !== remoteConfig.sitePassword) {
                sessionStorage.removeItem("site_access");
                switchScreen("authApp");
                const passInput = document.getElementById("passInput");
                if (passInput) passInput.value = "";
                const authError = document.getElementById("authError");
                if (authError) authError.style.display = "none";
            }

            applyAppsVisibility();
            filterApps();
        })
        .subscribe();

    document.getElementById("passInput")?.addEventListener("keydown", e => { if (e.key === "Enter") submitPassword(); });
    document.getElementById("appPassInput")?.addEventListener("keydown", e => { if (e.key === "Enter") submitAppPassword(); });

    const searchInput = document.getElementById("appSearchInput");
    if (searchInput) {
        searchInput.addEventListener("input", filterAppsDebounced); // Используем функцию с задержкой (Debounce)
        searchInput.addEventListener("keydown", e => {
            if (e.key === "Escape") { clearAppSearch(); searchInput.blur(); }
        });
    }

    document.addEventListener("click", e => {
        const dropdown = document.getElementById("filterDropdown");
        const filterBtn = document.getElementById("searchFilterBtn");
        if (dropdown && dropdown.classList.contains("active") && !dropdown.contains(e.target) && !filterBtn.contains(e.target)) {
            dropdown.classList.remove("active");
        }
    });
});

// Моментальное обновление при возврате на вкладку
document.addEventListener("visibilitychange", async () => {
    if (document.visibilityState === "visible") {
        const previousSitePassword = remoteConfig.sitePassword;
        const newConfig = await fetchSupabaseSettings();
        
        if (previousSitePassword && newConfig.sitePassword && previousSitePassword !== newConfig.sitePassword) {
            sessionStorage.removeItem("site_access");
            switchScreen("authApp");
            const passInput = document.getElementById("passInput");
            if (passInput) passInput.value = "";
            const authError = document.getElementById("authError");
            if (authError) authError.style.display = "none";
        }
        
        remoteConfig = newConfig;
        applyAppsVisibility();
        filterApps();
    }
});

async function handleOneTimeToken(token) {
    try {
        // 1. Делаем запрос на получение данных токена
        const response = await fetch(`${SUPABASE_URL}/rest/v1/one_time_links?token=eq.${token}&select=*`, {
            headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }
        });
        
        if (!response.ok) throw new Error("Ошибка проверки токена");
        
        const data = await response.json();

        if (data && data.length > 0) {
            const linkData = data[0];
            
            if (linkData.is_used) {
                switchScreen("tokenErrorApp");
                return;
            }

            const appKeys = linkData.app_keys || (linkData.app_key ? [linkData.app_key] : []);
            
            if (appKeys.length === 0) {
                switchScreen("tokenErrorApp");
                return;
            }

            // 2. СРАЗУ отрисовываем интерфейс, не дожидаясь ответа от PATCH запроса
            const singleTokenAppContainer = document.getElementById('singleTokenAppContainer');
            const tokenAppsContainer = document.getElementById('tokenAppsContainer');
            if (singleTokenAppContainer) singleTokenAppContainer.innerHTML = '';
            if (tokenAppsContainer) tokenAppsContainer.innerHTML = ''; 

            const targetContainer = appKeys.length >= 2 ? tokenAppsContainer : singleTokenAppContainer;

            appKeys.forEach(appKey => {
                const appInfo = appsData.find(a => a.key === appKey);
                if (appInfo) {
                    const appCard = document.createElement('div');
                    appCard.className = 'token-app-card';
                    appCard.innerHTML = `
                        <div class="token-app-info">
                            <img src="${appInfo.icon}" class="token-app-icon" alt="${appInfo.name}">
                            <span class="token-app-name">${appInfo.name}</span>
                        </div>
                        <button type="button" class="token-install-btn" onclick="startTokenInstall(this, 'itms-services://?action=download-manifest&url=${appInfo.url}', '${appKey}')" title="Установить">
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="7 10 12 15 17 10"></polyline>
                                <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                        </button>
                    `;
                    if(targetContainer) targetContainer.appendChild(appCard);
                }
            });

            const showAppsBtn = document.getElementById('showAppsBtn');
            if (appKeys.length >= 2) {
                if (singleTokenAppContainer) singleTokenAppContainer.style.display = 'none';
                if (showAppsBtn) {
                    showAppsBtn.style.display = 'flex';
                    showAppsBtn.innerHTML = `Показать список приложений (${appKeys.length})`;
                }
            } else {
                if (singleTokenAppContainer) singleTokenAppContainer.style.display = 'flex';
                if (showAppsBtn) showAppsBtn.style.display = 'none';
            }

            // Мгновенно переключаем экран
            switchScreen("tokenApp");

            // 3. Гасим токен в ФОНОВОМ режиме
            fetch(`${SUPABASE_URL}/rest/v1/one_time_links?token=eq.${token}`, {
                method: "PATCH",
                headers: { 
                    "apikey": SUPABASE_KEY, 
                    "Authorization": `Bearer ${SUPABASE_KEY}`,
                    "Content-Type": "application/json",
                    "Prefer": "return=minimal"
                },
                body: JSON.stringify({ is_used: true })
            }).catch(err => {
                console.error("Ошибка при фоновом гашении токена:", err);
            });

            return;
        }
        switchScreen("tokenErrorApp");
    } catch (e) {
        console.error("Ошибка проверки токена:", e);
        switchScreen("tokenErrorApp");
    }
}

function startTokenInstall(btn, url, appKey) {
    btn.innerHTML = `
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
    `;
    btn.classList.add("installed");

    window.location.href = url;

    const allButtons = document.querySelectorAll('.token-install-btn');
    const installedButtons = document.querySelectorAll('.token-install-btn.installed');
    
    if (allButtons.length > 0 && allButtons.length === installedButtons.length) {
        setTimeout(() => {
            closeTokenAppsSheet();
            switchScreen("tokenSuccessApp");
        }, 3000);
    }
}

function submitPassword() {
    const input = document.getElementById("passInput");
    const errorMsg = document.getElementById("authError");

    if (input.value.trim() === getSitePassword()) {
        sessionStorage.setItem("site_access", "true");
        switchScreen("mainApp");
        return;
    }

    errorMsg.style.display = "block";
    input.value = "";
    input.focus();
}

function openSheet() {
    if (isSheetClosing) return;

    applyAppsVisibility();

    const searchInput = document.getElementById("appSearchInput");
    if (searchInput) {
        searchInput.value = "";
        const searchClear = document.getElementById("searchClear");
        if (searchClear) searchClear.classList.remove("visible");
    }

    if (document.activeElement) document.activeElement.blur();

    filterApps();
    document.getElementById("sheetOverlay").classList.add("active");
}

function closeSheet() {
    if (isSheetClosing) return;
    isSheetClosing = true;

    const searchInput = document.getElementById("appSearchInput");
    if (searchInput) { 
        searchInput.value = ""; 
        searchInput.blur(); 
    }
    
    document.getElementById("filterDropdown")?.classList.remove("active");
    document.getElementById("sheetOverlay")?.classList.remove("active");

    document.querySelectorAll(".sheet-item").forEach(item => item.blur());
    filterApps();

    setTimeout(() => { isSheetClosing = false; }, 400);
}

function openGuideSheet() {
    document.getElementById("guideOverlay").classList.add("active");
}

function closeGuideSheet() {
    document.getElementById("guideOverlay").classList.remove("active");
}

function toggleFilterMenu() {
    document.getElementById("filterDropdown").classList.toggle("active");
}

function setCategory(cat, element) {
    currentCategory = cat;
    document.querySelectorAll(".filter-option").forEach(opt => opt.classList.remove("active"));
    if (element) element.classList.add("active");

    const filterBtn = document.getElementById("searchFilterBtn");
    if (cat !== "all") filterBtn.classList.add("active");
    else filterBtn.classList.remove("active");

    document.getElementById("filterDropdown").classList.remove("active");
    
    const sheetList = document.querySelector(".sheet-list");
    if (sheetList) sheetList.scrollTop = 0;

    filterApps();
}

// Оптимизированный поиск (Debounce)
let searchTimeout = null;
function filterAppsDebounced() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(filterApps, 150);
}

function filterApps() {
    const input = document.getElementById("appSearchInput");
    const query = input ? input.value.trim().toLowerCase() : "";
    const clearBtn = document.getElementById("searchClear");
    const emptyMessage = document.getElementById("searchEmpty");

    if (clearBtn) {
        clearBtn.classList.toggle("visible", query.length > 0);
    }

    let visibleCount = 0;

    document.querySelectorAll(".sheet-item").forEach(item => {
        if (item.getAttribute("data-visible") === "false") {
            item.style.display = "none";
            return;
        }

        const appNameElement = item.querySelector(".app-name");
        if (!appNameElement) return;

        const name = appNameElement.textContent.toLowerCase();
        const itemCategory = item.getAttribute("data-category") || "";
        
        const matchesQuery = name.includes(query);
        const matchesCategory = (currentCategory === "all" || itemCategory === currentCategory);

        if (!matchesQuery || !matchesCategory) {
            item.style.display = "none";
            return;
        }

        item.style.display = "flex";
        visibleCount++;
    });

    if (emptyMessage) {
        emptyMessage.style.display = visibleCount === 0 ? "block" : "none";
    }

    updateAppCounter(visibleCount);
}

function clearAppSearch() {
    const input = document.getElementById("appSearchInput");
    if (!input) return;
    input.value = "";
    filterApps();
    input.focus();
}

function selectApp(element, url, name, appKey) {
    if (isSheetClosing) return;

    selectedAppUrl = url;
    selectedAppKey = appKey;

    const selectedAppText = document.getElementById("selectedAppText");
    if (selectedAppText) {
        selectedAppText.textContent = name;
        selectedAppText.style.color = "#ffffff";
    }

    document.querySelector(".custom-select-btn")?.classList.add("has-selection");

    const appAuthNameEl = document.getElementById("appAuthAppName");
    if (appAuthNameEl) appAuthNameEl.textContent = name;

    document.querySelectorAll(".sheet-item").forEach(item => item.classList.remove("selected"));
    if (element) element.classList.add("selected");

    closeSheet();
}

function startInstallation() {
    if (!selectedAppUrl) return;

    const currentAppPassword = getAppPasswords()[selectedAppKey];
    if (currentAppPassword && currentAppPassword.trim() !== "") {
        document.getElementById("appPassError").style.display = "none";
        document.getElementById("appPassInput").value = "";
        switchScreen("appAuthApp");
        document.getElementById("appPassInput").focus();
        return;
    }

    window.location.href = selectedAppUrl;
}

function submitAppPassword() {
    const input = document.getElementById("appPassInput");
    const errorMsg = document.getElementById("appPassError");

    const currentAppPassword = getAppPasswords()[selectedAppKey];
    if (input.value.trim() === currentAppPassword) {
        switchScreen("mainApp");
        window.location.href = selectedAppUrl;
        return;
    }

    errorMsg.style.display = "block";
    input.value = "";
    input.focus();
}

function cancelAppPassword() {
    switchScreen("mainApp");
}

function openTokenAppsSheet() {
    const sheet = document.getElementById("tokenAppsSheetOverlay");
    if (sheet) sheet.classList.add("active");
}

function closeTokenAppsSheet() {
    const sheet = document.getElementById("tokenAppsSheetOverlay");
    if (sheet) sheet.classList.remove("active");
}
