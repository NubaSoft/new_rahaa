import Reactotron from 'reactotron-react-native';

Reactotron
  .configure({ name: 'raha' })
  .useReactNative()
  .connect();

console.tron = Reactotron;

export default Reactotron;
