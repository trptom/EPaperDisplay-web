export default {
  general: {
    moduleTypes: {
      1: 'Obrázek',
      2: 'Text',
      3: 'Počasí',
      4: 'Kalendář',
    },
  },
  modal: {
    image: {},
    displayModule: {
      title: 'Nastavení modulu',
      noModule: 'Žádný modul není vybrán',
      type: 'Typ modulu',
      position: 'Pozice',
      size: 'Velikost',
      btn: {
        save: 'Uložit změny',
        cancel: 'Zrušit',
      },
      staticImage: {
        url: 'URL',
      },
      simpleText: {
        text: 'Text',
      },
      calendar: {
        date: 'Datum',
      },
      weather: {
        location: 'Místo',
      },
    },
  },
  components: {
    moduleListTable: {
      noModules: 'Žádné moduly nejsou definovány.',
      title: 'Moduly',
      add: 'Přidat',
      delete: 'Smazat',
      edit: 'Upravit',
      colName: {
        position: '#',
        type: 'Typ',
        area: 'Pozice',
        actions: 'Akce',
      },
    },
  },
  menuBar: {
    toggle: 'Přepnout navigační lištu',
    home: 'Domů',
    about: 'O projektu',
    signin: 'Přihlášení',
    signinGoogle: 'Přihlásit se přes Google',
    signinFacebook: 'Přihlásit se přes Facebook',
    signout: 'Odhlášení',
    displays: 'Displeje',
  },
  publicDashboard: {
    header: 'Informace o aplikaci',
    subheader: 'Přehled a statistiky aplikace',
    loading: 'Načítám přehled…',
    error: 'Nepodařilo se načíst data přehledu.',
    empty: 'Žádná data přehledu.',
    usersCount: 'Uživatelé:',
    displaysCount: 'Displeje:',
    modulesCount: 'Dostupné vestavěné moduly:',
    totalDisplayed: 'Celkem [display] volání:',
  },
  privateDashboard: {
    header: 'Soukromý panel',
    subheader: 'Přehled a správa vašich soukromých displejů',
    loading: 'Načítám přehled…',
    error: 'Nepodařilo se načíst data přehledu.',
    empty: 'Žádná data přehledu.',
    displaysCount: 'Displeje:',
  },
  displays: {
    header: 'Displeje',
    subheader: 'Seznam a správa vašich displejů',
    add: 'Přidat',
    loading: 'Načítám seznam displejů…',
    error: 'Nepodařilo se načíst seznam displejů.',
    notFound: 'Žádné displeje nenalezeny.',
    table: {
      header: {
        id: 'ID',
        name: 'Název',
        model: 'Model',
        size: 'Velikost',
        ipFilter: 'IP Filtr',
        token: 'Token',
        displayed: 'Zobrazeno',
      },
      content: {
        ipFilter: {
          enabled: 'Povoleno',
          disabled: 'Zakázáno',
        },
      },
    },
  },
  display: {
    header: 'Nastavení displeje',
    subheader: {
      id: 'ID',
      token: 'Token',
    },
    btn: {
      view: 'Náhled',
      save: 'Uložit',
    },
    loading: 'Načítám displej…',
    error: 'Nepodařilo se načíst displej.',
    control: {
      name: 'Název',
      resolution: 'Rozlišení',
      model: 'Model',
    },
  },
  signIn: {
    title: 'Přihlásit se',
    email: 'E-mail',
    password: 'Heslo',
    remember: 'Zapamatovat si mě',
    noAccount: 'Nemáte účet?',

    button: {
      loading: 'Probíhá přihlášení...',
      submit: 'Přihlásit se',
      signUp: 'Zaregistrovat se',
    },

    error: 'Přihlášení se nezdařilo',
    errorFillAll: 'Je nutné vyplnit e-mail a heslo',
  },
}
