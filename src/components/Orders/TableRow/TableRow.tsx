import { ChevronDownIcon } from '@chakra-ui/icons'
import {
    Button,
    Center,
    Link,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Modal,
    ModalContent,
    ModalOverlay,
    Spinner,
    Td,
    Tr
} from '@chakra-ui/react'
import React, { FunctionComponent, useMemo } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
    REQUEST_COURIER_API_URL,
    PROCESS_ORDER_API_URL,
    FINISH_ORDER_API_URL
} from '../../../constants'
import { useProcessOrder } from '../../../hooks/Orders/useProcessOrder'
import { Order } from '../../../types/dto/order/Order'
import { ORDER_STATUS } from '../../../types/dto/order/OrderStatus'

interface Props {
    order: Order
}

export const TableRow: FunctionComponent<Props> = props => {
    const { order } = props

    const { isLoading, processOrder } = useProcessOrder()

    const requestCourier = processOrder(REQUEST_COURIER_API_URL, order.id)
    const proccess = processOrder(PROCESS_ORDER_API_URL, order.id, '/orders?tab=1')
    const finishOrder = processOrder(FINISH_ORDER_API_URL, order.id)

    const statusColor = useMemo<string>(() => {
        if (order.status === ORDER_STATUS.PAYMENT_SUCCEEDED) {
            return 'green.400'
        }

        if (order.status === ORDER_STATUS.PAYMENT_FAILED) {
            return 'red.500'
        }

        if (order.status === ORDER_STATUS.COURIER_REQUESTED) {
            return 'twitter.500'
        }

        if (order.status === ORDER_STATUS.PROCESSING) {
            return 'purple.400'
        }

        if (order.status === ORDER_STATUS.SHIPPED) {
            return 'yellow.300'
        }

        return 'gray.400'
    }, [order.status])

    return (
        <>
            <Tr key={order.id}>
                <Td textAlign='center'>{order.id}</Td>
                <Td>
                    <Link
                        color='blue.600'
                        href={process.env.REACT_APP_STRIPE_DASHBOARD_URL + order.paymentIntentId}
                        isExternal
                    >
                        {(process.env.REACT_APP_STRIPE_DASHBOARD_URL + order.paymentIntentId).slice(
                            0,
                            22
                        )}
                        ...
                    </Link>
                </Td>
                <Td>
                    <Link color='blue.600' href={order.pdfURL} isExternal>
                        {order.pdfURL?.slice(0, 22)}...
                    </Link>
                </Td>
                <Td>
                    <Link color='blue.600' href={order.recieptUrl} isExternal>
                        {order.recieptUrl?.slice(0, 22)}...
                    </Link>
                </Td>
                <Td fontSize='0.8rem' fontWeight='bold' color={statusColor}>
                    {order.status}
                </Td>
                <Td fontWeight='semibold' color='gray.600' textAlign='center'>
                    {order.total}лв.
                </Td>
                <Td alignItems='center'>
                    <Menu>
                        <MenuButton
                            colorScheme='twitter'
                            as={Button}
                            rightIcon={<ChevronDownIcon />}
                        >
                            Actions
                        </MenuButton>
                        <MenuList>
                            <MenuItem as={RouterLink} to={`/orders/${order.id}`}>
                                Open Order
                            </MenuItem>
                            {order.status === ORDER_STATUS.PAYMENT_SUCCEEDED && (
                                <MenuItem onClick={proccess}>Process Order</MenuItem>
                            )}
                            {order.status === ORDER_STATUS.PROCESSING && (
                                <MenuItem onClick={requestCourier}>Request Courier</MenuItem>
                            )}
                            {order.status === ORDER_STATUS.COURIER_REQUESTED ? (
                                <MenuItem onClick={finishOrder}>Finish Order</MenuItem>
                            ) : null}
                        </MenuList>
                    </Menu>
                </Td>
            </Tr>
            <Modal isOpen={isLoading} onClose={() => {}}>
                <ModalOverlay />
                <ModalContent background='transparent' shadow='none'>
                    <Center mt='12' mb='6'>
                        <Spinner color='white' size='xl' />
                    </Center>
                </ModalContent>
            </Modal>
        </>
    )
}
