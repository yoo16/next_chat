import { atom } from 'recoil'
import { recoilPersist } from 'recoil-persist'
const { persistAtom } = recoilPersist()

export const userState = atom({
    key: 'user',
    default: {
        id: 1,
        name: 'User1',
        email: 'test@test.com'
    },
    effects_UNSTABLE: [persistAtom]
})