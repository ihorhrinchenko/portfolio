/*
 * Project data model
 * ------------------
 * Add one object per personal project. Keep user-facing text in both `en` and
 * `de`. Optional fields can be omitted until real content is ready. The gallery
 * and detail page read this file directly, so no page markup needs to be copied.
 */
export const projects = [
  {
    id: "tonality",
    name: {
      en: "Tonality — Music Practice Companion",
      de: "Tonality — Begleiter fürs Musiküben",
    },
    description: {
      en: "A responsive web app that helps musicians identify key signatures, hear reference notes, tune by ear, and save favorite keys.",
      de: "Eine responsive Web-App, die Musikerinnen und Musikern hilft, Tonarten zu bestimmen, Referenztöne anzuhören, nach Gehör zu stimmen und bevorzugte Tonarten zu speichern.",
    },
    status: "completed",
    is_placeholder: false,
    github_url: "https://github.com/igorgrinchenko/tonality",
    live_demo_url: "https://tonality.netlify.app/",
    preview_image: "../assets/images/tonality.png",
    preview_alt: { en: "", de: "" },
    technologies: [
      "React",
      "TypeScript",
      "Vite",
      "Redux Toolkit",
      "React Router",
      "Material UI",
      "Firebase Authentication",
      "Cloud Firestore",
      "Progressive Web App",
    ],
    features: {
      en: [
        "Identify major and minor keys from sharps and flats",
        "Play piano reference tones and an A 440 Hz tuning note",
        "Save, manage, and replay favorite keys",
        "Create accounts with email verification and password recovery",
        "Store user preferences and presets in Firestore",
        "Install the app as a PWA",
        "Use the interface in English, German, or Ukrainian",
      ],
      de: [
        "Dur- und Molltonarten anhand von Kreuzen und Bs bestimmen",
        "Klavier-Referenztöne und den Kammerton A mit 440 Hz abspielen",
        "Bevorzugte Tonarten speichern, verwalten und erneut anhören",
        "Konten mit E-Mail-Bestätigung und Passwortwiederherstellung erstellen",
        "Einstellungen und Vorlagen in Firestore speichern",
        "Die App als PWA installieren",
        "Die Oberfläche auf Englisch, Deutsch oder Ukrainisch nutzen",
      ],
    },
    implementation_details: {
      en: "Built as a single-page React and TypeScript application with Vite. Redux Toolkit manages shared application state, React Router handles navigation, and Material UI provides the component system. Firebase Authentication supports account creation, sign-in, email verification, and password reset. Cloud Firestore stores user preferences and saved key presets. The PWA setup supports installation, while bundled piano samples provide the reference tones.",
      de: "Als React- und TypeScript-Single-Page-Anwendung mit Vite umgesetzt. Redux Toolkit verwaltet den gemeinsamen Anwendungszustand, React Router die Navigation und Material UI das Komponentensystem. Firebase Authentication ermöglicht Registrierung, Anmeldung, E-Mail-Bestätigung und Passwortwiederherstellung. Cloud Firestore speichert Einstellungen und gespeicherte Tonartvorlagen. Die PWA-Konfiguration ermöglicht die Installation; mitgelieferte Klavieraufnahmen liefern die Referenztöne.",
    },
    challenges: {
      en: "Designing an email verification flow that works across sign-up, sign-in, and resend states; handling production Firebase email-action URLs and rate limits; and keeping authentication state, user preferences, and protected routes in sync.",
      de: "Ein E-Mail-Bestätigungsverfahren zu gestalten, das bei Registrierung, Anmeldung und erneutem Versand zuverlässig funktioniert; Firebase-Aktionslinks und Versandlimits in der Produktionsumgebung zu berücksichtigen; sowie Authentifizierungsstatus, Einstellungen und geschützte Routen konsistent zu halten.",
    },
    lessons_learned: {
      en: "Authentication flows need clear success and error states, and Firebase email-action links depend on the production domain being configured correctly. Keeping translations and shared UI patterns consistent makes the app easier to maintain as features grow.",
      de: "Authentifizierungsabläufe brauchen klare Erfolgs- und Fehlermeldungen. Firebase-E-Mail-Aktionslinks setzen eine korrekt konfigurierte Produktionsdomain voraus. Einheitliche Übersetzungen und wiederverwendbare Oberflächenmuster erleichtern die Pflege, wenn die App wächst.",
    },
  },
  {
    id: "pet_project_two",
    name: { en: "Personal project 02", de: "Persönliches Projekt 02" },
    description: {
      en: "A project preview and description will be added here.",
      de: "Vorschau und Beschreibung des Projekts folgen.",
    },
    status: "placeholder",
    is_placeholder: true,
    github_url: "",
    live_demo_url: "",
    preview_image: "",
    preview_alt: { en: "", de: "" },
    technologies: [],
    features: { en: [], de: [] },
    implementation_details: { en: "", de: "" },
    challenges: { en: "", de: "" },
    lessons_learned: { en: "", de: "" },
  },
  {
    id: "pet_project_three",
    name: { en: "Personal project 03", de: "Persönliches Projekt 03" },
    description: {
      en: "Project details and implementation notes will be added here.",
      de: "Projektdetails und technische Notizen folgen.",
    },
    status: "placeholder",
    is_placeholder: true,
    github_url: "",
    live_demo_url: "",
    preview_image: "",
    preview_alt: { en: "", de: "" },
    technologies: [],
    features: { en: [], de: [] },
    implementation_details: { en: "", de: "" },
    challenges: { en: "", de: "" },
    lessons_learned: { en: "", de: "" },
  },
];

export function get_project(project_id) {
  if (!/^[a-z0-9_]+$/.test(project_id || "")) return undefined;
  return projects.find((project) => project.id === project_id);
}
