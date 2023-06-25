import { connectRefinementList } from "react-instantsearch-dom"
import { BiX } from 'react-icons/bi'


const CustomRefinementList = ({ items, refine }) => {
    const selectedItems = items.filter(item => item.isRefined);
    const clearFilters = () => {
        refine([]);
    }

    
    return (
        <div className='w-full'>
            {selectedItems.length > 0 && (
                <button className="p-2 absolute -top-1.5 -right-2 hover:text-red-300 anim-500" onClick={clearFilters}>
                    <BiX className="text-2xl" />
                </button>
            )}
            <ul className="flex flex-col">
                {items.map((item) => (
                    <li className="pb-2" key={item.value}>
                        <label className="flex justify-between p-2 border-b border-main_light_dark cursor-pointer hover:bg-[#cdcdcd] hover:rounded-xl dark:hover:bg-main_light_dark anim-500" style={item.isRefined ? { backgroundColor: "rgb(69,69,69)", borderRadius: "12px" } : {}} >
                            <div className="flex gap-3 items-center">
                                <input type="checkbox" checked={item.isRefined} onChange={() => refine(item.value)} />
                                <span className='text-sm max-md:text-xs'>{item.label}</span>
                            </div>
                            <span>{item.count}</span>
                        </label>
                    </li>
                ))}
            </ul>
            
        </div>
    );
};

export const RefinementList = connectRefinementList(CustomRefinementList);    