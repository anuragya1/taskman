export type RootStackParamList = {
    SplashScreen: undefined;
    Login: undefined;
    Signup: undefined;
    ForgotPassword: undefined;
    Main:undefined;
    Auth: undefined;
    Welcome:undefined;
  };

  export 
  interface Wishlistitem {
    title: string|undefined;
    description: string|undefined;
    category: string|undefined;
    priority: 'low' | 'medium' | 'high';
    due_date: string|number|Date;
    UserId:string|undefined;
  }
  interface WishlistItem {
    _id?: string;
    title: string|undefined;
    description: string|undefined;
    category: string|undefined;
    priority: 'low' | 'medium' | 'high';
    due_date: string | Date | number;
    UserId: string|undefined;
    Status: boolean;
  }
  export type DrawerParamList = {
    Home: undefined;
    Wishlist: undefined;
    Recommendation: undefined;
    Setting: undefined;
    Profile: undefined;
    showWishList:{task:WishlistItem};
    MakeWishList:{task:Wishlistitem};
  };
  