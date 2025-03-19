import {DebitCreditCards }from '@/components/balancesheet'
import { NextPage } from 'next'


const Page: NextPage = ({}) => {
  return <div className='w-full my-2 mx-2'>
    <DebitCreditCards/>
  </div>
}

export default Page