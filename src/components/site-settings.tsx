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
  headScripts: string
  bodyStartScripts: string
  bodyEndScripts: string
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
  headScripts: "",
  bodyStartScripts: "",
  bodyEndScripts: "",
  ogImage: "",
  ogType: "website",
  twitterCard: "summary_large_image",
}

// Head Scripts Component
export function SiteHeadScripts() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const loadSettings = async () => {
      try {
        const docRef = doc(db, "settings", "general")
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          setSettings({ ...defaultSettings, ...docSnap.data() })
        }
      } catch (err) {
        console.error("Error loading site settings:", err)
      }
    }
    loadSettings()
  }, [])

  if (!mounted) return null

  return (
    <>
      {/* Google Analytics */}
      {settings.googleAnalyticsId && (
        <>
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${settings.googleAnalyticsId}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${settings.googleAnalyticsId}');
              `,
            }}
          />
        </>
      )}

      {/* Google Tag Manager */}
      {settings.googleTagManagerId && (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${settings.googleTagManagerId}');
            `,
          }}
        />
      )}

      {/* Facebook Pixel */}
      {settings.facebookPixelId && (
        <script
          dangerouslySetInnerHTML={{
            __html: `
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
            `,
          }}
        />
      )}

      {/* Site Verification */}
      {settings.googleSiteVerification && (
        <meta name="google-site-verification" content={settings.googleSiteVerification} />
      )}
      {settings.bingVerification && (
        <meta name="msvalidate.01" content={settings.bingVerification} />
      )}

      {/* Keywords Meta */}
      {settings.siteKeywords && (
        <meta name="keywords" content={settings.siteKeywords} />
      )}

      {/* Author Meta */}
      {settings.author && (
        <meta name="author" content={settings.author} />
      )}

      {/* Open Graph Tags */}
      {settings.ogImage && (
        <>
          <meta property="og:image" content={settings.ogImage} />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
        </>
      )}
      <meta property="og:type" content={settings.ogType} />
      <meta property="og:site_name" content={settings.siteName} />

      {/* Twitter Card */}
      <meta name="twitter:card" content={settings.twitterCard} />
      {settings.ogImage && (
        <meta name="twitter:image" content={settings.ogImage} />
      )}

      {/* Custom Head Scripts */}
      {settings.headScripts && (
        <div dangerouslySetInnerHTML={{ __html: settings.headScripts }} />
      )}
    </>
  )
}

// Body Start Scripts (noscript tags)
export function SiteBodyStartScripts() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const loadSettings = async () => {
      try {
        const docRef = doc(db, "settings", "general")
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          setSettings({ ...defaultSettings, ...docSnap.data() })
        }
      } catch (err) {
        console.error("Error loading site settings:", err)
      }
    }
    loadSettings()
  }, [])

  if (!mounted) return null

  return (
    <>
      {/* Google Tag Manager (noscript) */}
      {settings.googleTagManagerId && (
        <noscript
          dangerouslySetInnerHTML={{
            __html: `
              <iframe src="https://www.googletagmanager.com/ns.html?id=${settings.googleTagManagerId}"
              height="0" width="0" style="display:none;visibility:hidden"></iframe>
            `,
          }}
        />
      )}

      {/* Facebook Pixel (noscript) */}
      {settings.facebookPixelId && (
        <noscript
          dangerouslySetInnerHTML={{
            __html: `
              <img height="1" width="1" style="display:none"
              src="https://www.facebook.com/tr?id=${settings.facebookPixelId}&ev=PageView&noscript=1"/>
            `,
          }}
        />
      )}

      {/* Custom Body Start Scripts */}
      {settings.bodyStartScripts && (
        <div dangerouslySetInnerHTML={{ __html: settings.bodyStartScripts }} />
      )}
    </>
  )
}

// Body End Scripts
export function SiteBodyEndScripts() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const loadSettings = async () => {
      try {
        const docRef = doc(db, "settings", "general")
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          setSettings({ ...defaultSettings, ...docSnap.data() })
        }
      } catch (err) {
        console.error("Error loading site settings:", err)
      }
    }
    loadSettings()
  }, [])

  if (!mounted) return null

  return (
    <>
      {settings.bodyEndScripts && (
        <div dangerouslySetInnerHTML={{ __html: settings.bodyEndScripts }} />
      )}
    </>
  )
}
