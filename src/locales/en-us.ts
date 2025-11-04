export default {
  modal: {
    image: {},
  },
  menuBar: {
    toggle: 'Toggle navigation bar',
    home: 'Home',
    about: 'About',
    signin: 'Sign In',
    signinGoogle: 'Sign in with Google',
    signinFacebook: 'Sign in with Facebook',
    signout: 'Sign Out',
    displays: 'Displays',
  },
  publicDashboard: {
    header: 'Application Information',
    subheader: 'Overview and statistics of the application',
    loading: 'Loading dashboard…',
    error: 'Unable to load dashboard data.',
    empty: 'No dashboard data.',
    usersCount: 'Users:',
    displaysCount: 'Displays:',
    modulesCount: 'Available builtin modules:',
    totalDisplayed: 'Total [display] calls:',
  },
  privateDashboard: {
    header: 'Private Dashboard',
    subheader: 'Overview and management of your private displays',
    loading: 'Loading dashboard…',
    error: 'Unable to load dashboard data.',
    empty: 'No dashboard data.',
    displaysCount: 'Displays:',
  },
  displays: {
    header: 'Displays',
    subheader: 'List and manage your displays',
    add: 'Add',
    loading: 'Loading displays…',
    error: 'Unable to load list of displays.',
    notFound: 'No displays found.',
    table: {
      header: {
        id: 'ID',
        name: 'Name',
        model: 'Model',
        size: 'Size',
        ipFilter: 'IP Filter',
        token: 'Token',
        displayed: 'Displayed',
      },
      content: {
        ipFilter: {
          enabled: 'Enabled',
          disabled: 'Disabled',
        },
      },
    },
  },
  display: {
    header: 'Display Settings',
    subheader: {
      id: 'ID',
      token: 'Token',
    },
    btn: {
      view: 'Preview',
      save: 'Save',
    },
    loading: 'Loading display…',
    error: 'Unable to load display.',
    control: {
      id: 'ID',
      name: 'Name',
    },
  },
  signIn: {
    title: 'Sign In',
    email: 'Email',
    password: 'Password',
    remember: 'Remember me',
    noAccount: "Don't have an account?",

    button: {
      loading: 'Signing in...',
      submit: 'Sign In',
      signUp: 'Sign Up',
    },

    error: 'Sign in failed',
    errorFillAll: 'Email and password are required',
  },
}
