import { createStackNavigator, createAppContainer } from 'react-navigation';

import SignIn from './pages/signIn';
import SignUp from './pages/signUp';
import Main from './pages/main';

const NavigationStack = createStackNavigator({
  SignIn,
  SignUp,
  Main,
});

const Routes = createAppContainer(NavigationStack);

export default Routes;