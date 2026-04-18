"use client"

import { useEffect, useState } from "react"
import { db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"

interface SiteSettings {
  siteName: string
  siteDescription: string
  siteKeywords: string
  author: string
  googleAnalyticsId: string
  googleTagManagerId: string
  facebookPixelId: string
  googleSiteVerification: string
  bingVerification: string
  ogImage: string
  ogType: string
  twitterCard: string
}

const defaultSettings: SiteSettings = {
  siteName: "PKonstruct",
  siteDescription: "Building Excellence Since 2005",
  siteKeywords: "construction, builder, contractor",
  author: "PKonstruct",
  googleAnalyticsId: "",
  googleTagManagerId: "",
  facebookPixelId: "",
  googleSiteVerification: "",
  bingVerification: "",
  ogImage: "",
  ogType: "website",
  twitterCard: "summary_large_image",
}

// This component injects dynamic SEO meta tags and analytics
export function DynamicHead() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const docRef = doc(db, "settings", "general")
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          setSettings({ ...defaultSettings, ...docSnap.data() })
        }
      } catch (err) {
        console.error("Error loading site settings:", err)
      } finally {
        setLoaded(true)
      }
    }
    loadSettings()
  }, [])

  useEffect(() => {
    if (!loaded) return

    // Update meta tags dynamically
    const updateMetaTag = (name: string, content: string, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`
      let meta = document.querySelector(selector) as HTMLMetaElement
      if (!meta) {
        meta = document.createElement("meta")
        if (property) {
          meta.setAttribute("property", name)
        } else {
          meta.setAttribute("name", name)
        }
        document.head.appendChild(meta)
      }
      meta.content = content
    }

    // Update basic meta tags
    if (settings.siteKeywords) {
      updateMetaTag("keywords", settings.siteKeywords)
    }
    if (settings.author) {
      updateMetaTag("author", settings.author)
    }

    // Update verification tags
    if (settings.googleSiteVerification) {
      updateMetaTag("google-site-verification", settings.googleSiteVerification)
    }
    if (settings.bingVerification) {
      updateMetaTag("msvalidate.01", settings.bingVerification)
    }

    // Update Open Graph tags
    if (settings.ogImage) {
      updateMetaTag("og:image", settings.ogImage, true)
      updateMetaTag("og:image:width", "1200", true)
      updateMetaTag("og:image:height", "630", true)
    }
    updateMetaTag("og:type", settings.ogType, true)
    updateMetaTag("og:site_name", settings.siteName, true)

    // Update Twitter Card
    updateMetaTag("twitter:card", settings.twitterCard)
    if (settings.ogImage) {
      updateMetaTag("twitter:image", settings.ogImage)
    }

    // Inject Google Analytics
    if (settings.googleAnalyticsId && !document.getElementById("ga-script")) {
      const script1 = document.createElement("script")
      script1.id = "ga-script"
      script1.async = true
      script1.src = `https://www.googletagmanager.com/gtag/js?id=${settings.googleAnalyticsId}`
      document.head.appendChild(script1)

      const script2 = document.createElement("script")
      script2.id = "ga-config"
      script2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${settings.googleAnalyticsId}');
      `
      document.head.appendChild(script2)
    }

    // Inject Google Tag Manager
    if (settings.googleTagManagerId && !document.getElementById("gtm-script")) {
      const script = document.createElement("script")
      script.id = "gtm-script"
      script.innerHTML = `
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${settings.googleTagManagerId}');
      `
      document.head.appendChild(script)
    }

    // Inject Facebook Pixel
    if (settings.facebookPixelId && !document.getElementById("fb-pixel")) {
      const script = document.createElement("script")
      script.id = "fb-pixel"
      script.innerHTML = `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${settings.facebookPixelId}');
        fbq('track', 'PageView');
      `
      document.head.appendChild(script)

      // Add noscript version
      if (!document.getElementById("fb-pixel-noscript")) {
        const noscript = document.createElement("noscript")
        noscript.id = "fb-pixel-noscript"
        const img = document.createElement("img")
        img.height = 1
        img.width = 1
        img.style.display = "none"
        img.src = `https://www.facebook.com/tr?id=${settings.facebookPixelId}&ev=PageView&noscript=1`
        noscript.appendChild(img)
        document.body.insertBefore(noscript, document.body.firstChild)
      }
    }

    // Inject GTM noscript
    if (settings.googleTagManagerId && !document.getElementById("gtm-noscript")) {
      const noscript = document.createElement("noscript")
      noscript.id = "gtm-noscript"
      const iframe = document.createElement("iframe")
      iframe.src = `https://www.googletagmanager.com/ns.html?id=${settings.googleTagManagerId}`
      iframe.height = "0"
      iframe.width = "0"
      iframe.style.display = "none"
      iframe.style.visibility = "hidden"
      noscript.appendChild(iframe)
      document.body.insertBefore(noscript, document.body.firstChild)
    }

  }, [loaded, settings])

  return null // This component doesn't render anything
}
