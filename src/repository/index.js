import httpClient from '@/module/request/index'


export function getProjects() {
    return httpClient({
        url: '/project',
        method: 'GET'
    })
}

export function categoryServiceStartup(res) {
    return httpClient({
        url: '/service/category/startup?res=' + res,
        method: 'GET'
    })
}

export function bookServiceStartup(res, query = []) {
    return httpClient({
        url: '/service/book/startup?res=' + res,
        method: 'POST',
        data: query
    })
}

export function killService(id, type) {
    return httpClient({
        url: '/project/kill',
        method: 'POST',
        data: {
            id: id + '',
            type: type
        }
    })
}


export function simpleCategorys() {
    return httpClient({
        url: '/simpleCategory',
        method: 'GET'
    })
}

export function categorys() {
    return httpClient({
        url: '/category',
        method: 'GET'
    })
}

export function updateCategory(id, name) {
    return httpClient({
        url: 'category/update',
        method: 'POST',
        data: {
            id: id,
            name: name
        }
    })
}

export function books(keyword = '', categoryId = '', page = 1) {
    return httpClient({
        url: '/book',
        method: 'GET',
        params: {
            keyword: keyword,
            categoryId: categoryId,
            page: page
        }
    })
}

export function updateCoverLockState(id, state) {
    return httpClient({
        url: '/book/coverState',
        method: 'POST',
        data: {
            id: id,
            state: state
        }
    })
}

export function updateBook(form) {
    return httpClient({
        url: '/book/edit',
        method: 'POST',
        data: form
    })
}

export function deleteBook(id) {
    return httpClient({
        url: '/book/delete',
        method: 'POST',
        data: {
            id: id
        }
    })
}

export function getSimpleChapterList(bookId) {
    return httpClient({
        url: '/chapter',
        method: 'GET',
        params: {
            bookId: bookId
        }
    })
}

export function deleteChapterById(id) {
    return httpClient({
        url: '/chapter/delete',
        method: 'POST',
        data: {
            id: id
        }
    })
}

export function deleteAllChapter(bookId) {
    return httpClient({
        url: '/chapter/clear',
        method: 'POST',
        data: {
            bookId: bookId
        }
    })
}

export function findBookurl(bookName, author) {
    return httpClient({
        url: '/search/bookurl',
        method: 'POST',
        data: {
            bookName: bookName,
            author: author
        }
    })
}

export function queryBookurl(data) {
    return httpClient({
        url: '/bookurl',
        method: 'POST',
        data: data
    })
}

export function deleteBookurl(data) {
    return httpClient({
        url: '/bookurl/delete',
        method: 'POST',
        data: data
    })
}

export function updateBookUrl(data) {
    return httpClient({
        url: '/bookurl/update',
        method: 'POST',
        data: data
    })
}

export function aa() {
    return httpClient({
        url: '/book'
    })
}