import { MdKeyboardArrowDown } from 'react-icons/md'
import { AiOutlineMenu } from 'react-icons/ai'
import { InstantSearch, Pagination } from "react-instantsearch-dom"
import algoliasearch from "algoliasearch/lite"
import { RefinementList } from '../components/customRefinementList'
import { SearchBox } from '../components/customSearchBox'
import { Hits } from '../components/Hit'
import { useState } from 'react'

const searchClient = algoliasearch('BE7H63GVIG', '649b2e866a6455ec4bb44d89c94315da')
const index = searchClient.initIndex('events')


export default function Home() {
    const [ categoryShow, setCategoryShow ] = useState(false)
    const [ eventAddressShow, setEventAddressShow ] = useState(false)
    const [ menuShow, setMenuShow ] = useState(false)

    const toggleShowMore = (att) => {
        if (att === 'category') {
            setCategoryShow(!categoryShow)
        }
        if (att === 'eventAddress') {
            setEventAddressShow(!eventAddressShow)
        }
    }

    return (
        <div className="w-full flex gap-5">
            <InstantSearch searchClient={searchClient} indexName='events'>
                <div className="w-full flex flex-col items-end gap-5 p-5 bg-main_light sm:border-2 border-main_light_dark dark:bg-dark rounded-3xl">
                    <div className='w-full flex flex-col gap-3'>
                        <div className='flex gap-3'>
                            <SearchBox />
                            <button onClick={() => setMenuShow(!menuShow)} className='sm:hidden p-2 w-12 h-12 flex items-center justify-center rounded-full border border-main_light_dark hover:border-main_light_gray anim-500'><AiOutlineMenu /></button>
                        </div>
                        <div className={`w-[400px] ${menuShow ? 'flex' : 'hidden'} max-lg:w-[300px] h-fit flex flex-col gap-5 p-5 bg-main_light sm:border-2 border-main_light_dark dark:bg-dark rounded-3xl`}>
                            <h2 className='font-semibold text-xl max-md:text-lg'>Filteler</h2>
                            <hr />
                            <div className='flex flex-col gap-2 relative'>
                                <h3 className='text-lg max-md:text-base font-gilroy'>Kategoriler</h3>
                                <div className='flex flex-col items-center gap-2'>
                                    <RefinementList attribute="category" limit={5} showMore={categoryShow} />
                                    <button type='button' className={`${categoryShow && 'rotate-180'}`} onClick={() => toggleShowMore('category')}><MdKeyboardArrowDown className='text-2xl hover:translate-y-2 anim-500' /></button>
                                </div>
                            </div>
                            <div className='flex flex-col gap-2 relative'>
                                <h3 className='text-lg max-md:text-base font-gilroy'>Etkinlik Konumları</h3>
                                <div className='flex flex-col items-center gap-2'>
                                    <RefinementList attribute="eventAddress" limit={5} showMoreLimit={100} showMore={eventAddressShow} />
                                    <button type='button' className={`${eventAddressShow && 'rotate-180'}`} onClick={() => toggleShowMore('eventAddress')}><MdKeyboardArrowDown className='text-2xl hover:translate-y-2 anim-500' /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Pagination />
                    <Hits hitComponent={Hits} />
                </div>
                
                <div className={`w-[400px] max-sm:hidden max-lg:w-[330px] h-fit flex flex-col gap-5 p-5 bg-main_light sm:border-2 border-main_light_dark dark:bg-dark rounded-3xl`}>
                    <h2 className='font-semibold text-xl max-md:text-lg'>Filteler</h2>
                    <hr />
                    <div className='flex flex-col gap-2 relative'>
                        <h3 className='text-lg max-md:text-base font-gilroy'>Kategoriler</h3>
                        <div className='flex flex-col items-center gap-2'>
                            <RefinementList attribute="category" limit={5} showMore={categoryShow} />
                            <button type='button' className={`${categoryShow && 'rotate-180'}`} onClick={() => toggleShowMore('category')}><MdKeyboardArrowDown className='text-2xl hover:translate-y-2 anim-500' /></button>
                        </div>
                    </div>
                    <div className='flex flex-col gap-2 relative'>
                        <h3 className='text-lg max-md:text-base font-gilroy'>Etkinlik Konumları</h3>
                        <div className='flex flex-col items-center gap-2'>
                            <RefinementList attribute="eventAddress" limit={5} showMoreLimit={100} showMore={eventAddressShow} />
                            <button type='button' className={`${eventAddressShow && 'rotate-180'}`} onClick={() => toggleShowMore('eventAddress')}><MdKeyboardArrowDown className='text-2xl hover:translate-y-2 anim-500' /></button>
                        </div>
                    </div>
                </div>
            </InstantSearch>
        </div>
    )
}



                