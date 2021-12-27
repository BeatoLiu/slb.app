import { RouteRecordRaw } from 'vue-router'
import { t } from "@/hooks/setting/useI18n"

export const mineRoutes: Array<RouteRecordRaw> = [
    // 賬單明細
    {
        path: '/mine/selectMemberBenefitList',
        name: 'SelectMemberBenefitList',
        component: () => import('../views/mine/SelectMemberBenefitList.vue'),
        meta: {
            title: t('routes.selectMemberBenefitList')
        }
    },
    // 節點列表
    {
        path: '/mine/eleList',
        name: 'EleList',
        component: () => import('../views/mine/EleList.vue'),
        meta: {
            title: t('routes.eleList')
        }
    },
    // 提現帳號
    {
        path: '/mine/takeCashAccount',
        name: 'TakeCashAccount',
        component: () => import('../views/mine/takeCash/TakeCashAccount.vue'),
        meta: {
            title: t('routes.takeCashAccount')
        }
    },
    // 修改收益類型
    {
        path: '/mine/incomeType',
        name: 'IncomeType',
        component: () => import('../views/mine/takeCash/IncomeType.vue'),
        meta: {
            title: t('routes.incomeType')
        }
    },
    // pos機列表
    {
        path: '/mine/pos/list',
        name: 'PosList',
        component: () => import('../views/mine/pos/index.vue'),
        meta: {
            title: t('routes.posList')
        }
    },
    // 綁定pos機
    {
        path: '/mine/pos/add',
        name: 'AddPos',
        component: () => import('../views/mine/pos/AddPos.vue'),
        meta: {
            title: t('routes.addPos')
        }
    },
    // 地址列表
    {
        path: '/mine/address/list',
        name: 'AddressList',
        component: () => import('../views/mine/address/index.vue'),
        meta: {
            title: t('routes.addressList')
        }
    },
    // 新增地址
    {
        path: '/mine/address/add',
        name: 'AddAddress',
        component: () => import('../views/mine/address/AddAddress.vue'),
        meta: {
            title: t('routes.addAddress')
        }
    },
    // 修改地址
    {
        path: '/mine/address/edit',
        name: 'EditAddress',
        component: () => import('../views/mine/address/EditAddress.vue'),
        meta: {
            title: t('routes.editAddress')
        }
    },


    // 銀行卡
    {
        path: '/mine/banCard',
        name: 'BankCard',
        component: () => import('../views/mine/bankCard/index.vue'),
        meta: {
            title: t('routes.banCard')
        }
    },
    // 銀行卡新增
    {
        path: '/mine/backCard/add',
        name: 'AddBankCard',
        component: () => import('../views/mine/bankCard/AddCard.vue'),
        meta: {
            title: t('routes.addBankCard')
        }
    },
    // 白皮书
    {
        path: '/mine/whitePaper',
        name: 'WhitePaper',
        component: () => import('../views/mine/WhitePaper.vue'),
        meta: {
            title: t('routes.whitePaper')
        }
    },
    // 我的资产
    {
        path: '/mine/property',
        name: 'Property',
        component: () => import('../views/mine/property'),
        meta: {
            title: t('routes.property')
        }
    },
    // 我的余额
    {
        path: '/mine/property/balance',
        name: 'Balance',
        component: () => import('../views/mine/property/Balance'),
        meta: {
            title: t('routes.balance')
        }
    },
    // 我的收款码
    {
        path: '/mine/property/collectionsQR',
        name: 'CollectionsQR',
        component: () => import('../views/mine/property/CollectionsQR'),
        meta: {
            title: t('routes.collectionsQR')
        }
    },
    // 转账
    {
        path: '/mine/property/transfer',
        name: 'Transfer',
        component: () => import('../views/mine/property/Transfer'),
        meta: {
            title: t('routes.transfer')
        }
    },
    // 转账到链上
    {
        path: '/mine/property/transferToChain',
        name: 'TransferToChain',
        component: () => import('../views/mine/property/TransferToChain'),
        meta: {
            title: t('routes.transferToChain')
        }
    },
    // 链上转账到q钱包
    {
        path: '/mine/property/transferFromChain',
        name: 'TransferFromChain',
        component: () => import('../views/mine/property/TransferFromChain'),
        meta: {
            title: t('routes.transferFromChain')
        }
    },
    // 链上转账到q钱包
    {
        path: '/mine/property/transferRecord',
        name: 'TransferRecord',
        component: () => import('../views/mine/property/TransferRecord'),
        meta: {
            title: t('routes.transferRecord')
        }
    },
    // 扫码转账
    {
        path: '/mine/property/transferFromScan',
        name: 'TransferFromScan',
        component: () => import('../views/mine/property/TransferFromScan'),
        meta: {
            title: t('routes.transfer')
        }
    },
    // 设置支付密码
    {
        path: '/mine/setPayPWD',
        name: 'SetPayPWD',
        component: () => import('../views/mine/SetPayPWD.vue'),
        meta: {
            title: t('routes.setPayPWD')
        }
    },
    // 修改支付密码
    {
        path: '/mine/updatePayPWD',
        name: 'UpdatePayPWD',
        component: () => import('../views/mine/UpdatePayPWD.vue'),
        meta: {
            title: t('routes.updatePayPWD')
        }
    }
]
