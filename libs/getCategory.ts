import categoryData from 'public/data/category.json'

interface Items {
  name: string
  value: any[]
}

const findItems = (data: any, categoryName: string): Items[] => {
  return data.filter((item: Items) => item.name === categoryName)
}

export const getMainCategorys = () => {
  return categoryData.map((item) => item.name)
}

export const getSubCateogrys = (mainCategory: string) => {
  const items = findItems(categoryData, mainCategory)
  const subCategorys = !items.length
    ? []
    : items[0].value.map((item) => item.name)

  return subCategorys
}

export const getItemCategorys = (mainCategory: string, subCategory: string) => {
  const mainItems = findItems(categoryData, mainCategory)
  if (!mainItems.length) return []
  const subItems = findItems(mainItems[0].value, subCategory)
  const itemCategorys = !subItems.length ? [] : subItems[0].value

  return itemCategorys
}
