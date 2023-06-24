import { connectSearchBox } from 'react-instantsearch-dom'
import { IoSearch } from 'react-icons/io5'

const CustomSearchBox = ({ currentRefinement, refine }) => (
    <label className="w-full relative">
        <input type="search" value={currentRefinement} placeholder="Etkinlik ara" onChange={event => refine(event.currentTarget.value)} className='w-full p-3 px-6 rounded-2xl font-normal bg-white border-2 border-main_light_dark dark:bg-transparent placeholder:text-neutral-400 dark:focus:placeholder:text-main_light outline-none dark:focus:bg-main_text anim-500 overflow-hidden'/>
        <button className="absolute right-4 top-3"><IoSearch className="text-xl" /></button>    
    </label>
);

export const SearchBox = connectSearchBox(CustomSearchBox);
