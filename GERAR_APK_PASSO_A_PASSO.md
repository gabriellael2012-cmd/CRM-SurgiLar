# 📱 Como Gerar e Instalar o APK do CRM Kely Alves no Android

O projeto está **100% configurado com Capacitor Android, Service Worker e PWA nativo**. Abaixo estão as formas mais rápidas e práticas para instalar no celular ou gerar o arquivo `.apk`.

---

## ⚡ Método 1: Instalação Direta Instantânea no Celular (Sem precisar compilar)
O CRM já possui suporte nativo a **PWA (Progressive Web App)** completo com Splash Screen, ícone de aplicativo, funcionamento offline e tela cheia.

1. No celular Android, abra o navegador **Google Chrome**.
2. Acesse a URL do aplicativo gerada no AI Studio (botão **Share / Compartilhar** ou **Live Preview**).
3. Toque no menu do Chrome (os **três pontinhos** no canto superior direito).
4. Selecione **"Instalar aplicativo"** ou **"Adicionar à tela inicial"**.
5. O ícone **CRM Kely** aparecerá na gaveta de aplicativos do seu Android, abrindo direto como um aplicativo nativo em tela cheia com splash screen!

---

## 🛠️ Método 2: Gerar o arquivo `.apk` com Android Studio (Grátis & 1 Clique)

1. No AI Studio, clique em **Export** (ou baixe o projeto em arquivo ZIP).
2. Extraia o ZIP no seu computador.
3. Abra o **Android Studio**.
4. Clique em **Open** e selecione a pasta `android` do projeto.
5. No menu superior do Android Studio, clique em:
   **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**.
6. Em ~30 segundos, o Android Studio gerará o arquivo:
   `android/app/build/outputs/apk/debug/app-debug.apk`
7. Transfira esse arquivo para o celular via WhatsApp, Google Drive ou cabo USB e instale diretamente.

---

## 🤖 Método 3: Gerar APK Automático no GitHub Actions (Sem instalar nada no PC)

O arquivo `.github/workflows/build-apk.yml` já está configurado no projeto!

1. Exporte este projeto para o seu **GitHub** (pelo menu Export do AI Studio).
2. Ao fazer o push ou acessar a aba **Actions** no seu repositório GitHub:
   - Clique em **"Gerar APK Android - CRM Kely Alves"**.
   - Clique em **"Run workflow"**.
3. O GitHub compilará os arquivos e disponibilizará o arquivo **`CRM-Kely-Alves-Android-APK`** para download direto na aba *Artifacts*.

---

## 🌐 Método 4: Gerador Online Instantâneo (PWABuilder)

1. Acesse: [https://www.pwabuilder.com/](https://www.pwabuilder.com/)
2. Cole a URL pública do CRM Kely Alves.
3. Clique em **"Build My PWA"** > Selecione **Android**.
4. Baixe o pacote pronto para Google Play ou o APK de teste gerado na hora.

---

### 📂 Estrutura de Arquivos Android Pronta no Projeto:
- `capacitor.config.ts`: Configurações de pacote (`br.com.surgilar.crmkely`), splash screen e tela cheia.
- `android/`: Projeto nativo completo sincronizado com os arquivos web (`npm run build:android`).
- `android/app/src/main/AndroidManifest.xml`: Permissões nativas (Notificações, Vibração, Internet).
- `public/manifest.json` & `public/sw.js`: PWA e Service Worker para Android.
- `.github/workflows/build-apk.yml`: Compilação automática de APK na nuvem.
