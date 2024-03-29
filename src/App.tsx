import { Button } from '@chakra-ui/react'
import React, { FunctionComponent, useContext } from 'react'
import { Route, Switch } from 'react-router-dom'
import { Layout } from './components/Layout'
import { AuthContext } from './context/Auth/AuthContext'
import { AuthContextInterface } from './context/Auth/AuthContext.interface'
import { useRefreshToken } from './hooks/Auth/useRefreshToken'
import { Login } from './pages/Login'
import { Orders } from './pages/Orders'
import { Register } from './pages/Register'
import { Order } from './pages/Order'

interface Props {}

export const App: FunctionComponent<Props> = props => {
    const { authState } = useContext<AuthContextInterface>(AuthContext)

    useRefreshToken()

    return (
        <Layout>
            {authState ? (
                <Switch>
                    <Route path='/register' exact>
                        <Register />
                    </Route>

                    <Route path='/products' exact>
                        <h1>Products</h1>
                    </Route>
                    <Route path='/orders' exact>
                        <Orders />
                    </Route>
                    <Route path='/orders/:id' exact>
                        <Order />
                    </Route>
                    <Route path='/' exact>
                        <h1>Home</h1>
                        <Button colorScheme='green'>Home</Button>
                    </Route>
                </Switch>
            ) : (
                <Login />
            )}
        </Layout>
    )
}
