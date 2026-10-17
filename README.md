# LaganMantra – Website + Mobile App + Google Sheet (Guide)

Is folder me 4 cheezein hain:

| Folder / file | Kya hai |
|---|---|
| `docs/` | Poori website (index.html) + app install files (manifest, sw.js, icons). **Ye poora folder hosting par upload karna hai.** |
| `Code.gs` | Google Sheet ke liye script (secret pehle se bhara hua). |
| `android-app/` + `.github/` | Android APK banane ka kit (GitHub par apne-aap APK banta hai). |
| `README.md` | Ye guide. |

---

## STEP 1 – Google Sheet ko live jodna (10 minute, ek baar)

1. Apni Google Sheet kholo → **Extensions → Apps Script**.
2. Wahan jo bhi code hai sab hata do, `Code.gs` ka poora code paste karo → **Save** (💾).
3. **Deploy → New deployment** → ⚙ icon se type **Web app** chuno
   - Execute as: **Me**
   - Who has access: **Anyone**
   - **Deploy** dabao → Google permission maangega → apna account chuno → *Advanced → Go to project (unsafe)* → **Allow**.
4. **Web app URL** copy karo (`https://script.google.com/macros/s/..../exec`).
5. `docs/index.html` ko Notepad / VS Code me kholo, **Ctrl+F** se `const GS_URL=""` dhoondo aur URL beech me paste karo:
   ```js
   const GS_URL="https://script.google.com/macros/s/XXXX/exec",GS_TOKEN="LM-cbc34b700370c4b8d0609016";
   ```
   (GS_TOKEN pehle se bhara hai – use mat badlo.)
6. Save karke website dobara upload karo.
7. Check: website kholo → `#/admin` → login `admin / admin123` → **📊 Google Sheet** tab → **Send test row**. Sheet me "Test" naam ka tab ban jayega.

Ab jaise hi koi bhi visitor (kisi bhi phone/computer se) register karega, 2 second me Sheet ke **Users** tab me nayi row aa jayegi. Payments, Requests, Contact requests, Red alerts bhi alag tabs me aate hain. Pehli baar purana data bhejne ke liye admin panel me **⟳ Sync all data now** dabao.

> ⚠ Agar baad me `Code.gs` me kuch badlo to **Deploy → Manage deployments → Edit (✏) → Version: New version → Deploy** karna zaroori hai, warna purana code hi chalta rahega.

---

## STEP 2 – Website live karna (GitHub Pages)

Repository → **Settings → Pages** → Source: *Deploy from a branch* → Branch: **main**, folder: **/docs** → Save. 2-3 minute me site `https://<username>.github.io/<repo-naam>/` par live ho jayegi. App bhi isi live site ko kholta hai.

Ya phir kisi aur hosting par:

`docs/` folder ki **saari files** (index.html, manifest.webmanifest, sw.js, icon-*.png) apni hosting (Hostinger / GoDaddy / Netlify / GitHub Pages) ke main folder me upload karo. Site **https** par honi chahiye – tabhi "Install app" button aata hai.

Admin panel: `https://aapki-site.com/#/admin`

---

## STEP 3 – Mobile app

### Option A – Turant (koi coding nahi): Install as app
Website kholo → header me **📲 Download Our App** → Android par *Install app*, iPhone par *Share → Add to Home Screen*. Ye full-screen app ki tarah khulta hai, colourful bottom menu ke saath.

### Option B – Asli Android APK file (GitHub par free, ~10 minute)
1. github.com par free account banao → **New repository** (naam: `laganmantra-app`, Public).
2. **Add file → Upload files** → is folder ki **saari cheezein** drag karo (`docs`, `android-app`, `.github`, `Code.gs`, `README.md`).
   *Note:* `.github` folder chhupa hota hai – Windows me *View → Hidden items* on karo, Mac me `Cmd+Shift+.` dabao.
3. **Commit changes** dabao. Ab **Actions** tab kholo – "Build LaganMantra Android APK" chalega (5-8 minute).
4. Green ✔ aane ke baad **Releases → LaganMantra App (latest) → LaganMantra.apk** download karo. Ye phone par install ho jayegi (phone pucchega "Install unknown apps" – Allow karo).
5. GitHub Pages par Download App button ka APK link apne-aap ban jata hai. Kisi aur hosting par ho to APK ka link hoga:
   `https://github.com/<aapka-username>/laganmantra-app/releases/download/latest-apk/LaganMantra.apk`
   Ye link `index.html` me `const APK_URL=""` ke andar paste karo → ab website ke **Download App** popup me "Android (APK)" button aa jayega.

Website me kuch bhi badlo → GitHub par `docs/index.html` dobara upload karo → APK apne-aap nayi ban jayegi.

**Play Store par daalna ho to:** Google Play Console account (one-time $25) chahiye aur signed release (.aab) banana padega – jab aap ready ho, bataiye, uska workflow bhi add kar denge.

---

## Zaroori baat (data ke baare me)
Abhi profiles, chat aur requests har user ke **apne phone/browser** me save hote hain, aur Google Sheet me sirf ek copy jaati hai (one-way). Matlab Delhi wala user Mumbai wale ka naya profile tab tak nahi dekhega jab tak asli online database (jaise Firebase / Supabase) na lagaya jaye. Real launch se pehle ye karna zaroori hai – Sheet records aur admin ke liye perfect hai, par app ka main database nahi ban sakti.
