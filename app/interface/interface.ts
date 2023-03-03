export  type { menuItem, subMenu }
type menuItem ={
    name: string
    url: string
    subMenu?: subMenu[]

}
type subMenu = {
    name?: string
}