export const filterOpenMenu = (item) => {
    if ('items' in item) {
        let items = []
        items = item.items
        

        if (items.length > 0) {
            let activeItem = items.map((item) => route().current(item.active))
            item.open = activeItem.includes(true)
            item.items = items.filter((item) => (item.show ? item : null))
            return item
        }
    }
    
    return item
    
}
