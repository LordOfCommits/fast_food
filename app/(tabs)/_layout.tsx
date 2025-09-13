import { Redirect, Slot } from 'expo-router'

 const _Layout = () => {
  const isAuth = true;

  if(!isAuth) return <Redirect  href={'/sign-in'} />
  return <Slot />
 }

export default _Layout