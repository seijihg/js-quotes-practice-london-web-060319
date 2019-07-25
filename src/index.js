// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 
const quoteList = document.querySelector("#quote-list")
const newQuoteForm = document.querySelector("#new-quote-form")
const toggleButton = document.querySelector("#toggle")
toggleButton.addEventListener("click", () => sortQuotes())
let switch_value = "id"

document.addEventListener("DOMContentLoaded", (event) => {
    listQuotes(switch_value)

})

const listQuotes = (switch_value) => {
    quoteList.innerHTML = ""
    fetchData(switch_value)
    .then(quotes => {
        quotes.forEach(quote => {
            buildQuote(quote)
        })
    })
}

const sortQuotes = () => {
    switch_value == "id" ? switch_value = "author" : switch_value = "id"
    listQuotes(switch_value)
}

const fetchData = (sort = "id") => {
    return fetch(`http://localhost:3000/quotes?_sort=${sort}&_embed=likes`)
    .then(resp => resp.json())
}

const postLikes = (quote) => {
    
    fetch("http://localhost:3000/likes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            quoteId: parseInt(quote.id),
            createdAt: Date.now()
        })
    })
    .then(resp => resp.json())
    .then(listQuotes)
}

const buildQuote = (quote) => {

    const like_numbers = quote.likes.length

    const newLi = document.createElement("li")
    newLi.className = "quote-card"

    quoteList.appendChild(newLi)

    const newQuote = document.createElement("blockquote")
    newQuote.className = "blockquote"
    const quoteMaster = newLi.appendChild(newQuote)

    const newP = document.createElement("p")
    newP.innerText = quote.quote
    const newFooter = document.createElement("footer")
    newFooter.className = "blockquote-footer"
    newFooter.innerText = quote.author
    const newBr = document.createElement("br")
    const newButton1 = document.createElement("button")
    newButton1.className = "btn-success"
    newButton1.innerText = `Likes: ${like_numbers}`
    newButton1.addEventListener("click", () => postLikes(quote))
    const newButton2 = document.createElement("button")
    newButton2.className = "btn-danger"
    newButton2.innerText = "Delete"
    newButton2.addEventListener("click", () => deleteButtonFunction(quote))
    const newButton3 = document.createElement("button")
    newButton3.innerText = "Edit"
    newButton3.addEventListener("click", revealForm)

    //-- make form hidden

    const newEditForm = document.createElement("form")
    newEditForm.addEventListener("submit", (event) => editQuote(event, quote))
    newEditForm.hidden = true
    newEditForm.id = "editform"
    const quoteInput = document.createElement("input")
    quoteInput.placeholder = quote.quote
    quoteInput.id = "edit_quote"
    const authorInput = document.createElement("input")
    authorInput.placeholder = quote.author
    authorInput.id = "edit_author"
    const formButton = document.createElement("input")
    formButton.value = "Submit"
    formButton.type = "submit"

    newEditForm.append(quoteInput, authorInput, formButton)


    quoteMaster.append(newP, newFooter, newBr, newButton1, newButton2, newButton3, newEditForm)
}

const revealForm = (event) => {
    const form = event.target.parentElement.querySelector("#editform")
    form.toggleAttribute('hidden')

}

const fetchPatch = (newq, newau, id) => {
    return fetch(`http://localhost:3000/quotes/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            quote: newq,
            author: newau
        })
    })
    .then(resp => resp.json())
}

const editQuote = (event, quote) => {
    event.preventDefault()
    const author = event.target.edit_author.value
    const quotee = event.target.edit_quote.value
    fetchPatch(quotee, author, quote.id)
    .then(listQuotes)
}

const fetchDelete = (quote) => {
    return fetch(`http://localhost:3000/quotes/${quote.id}`, {
        method: "DELETE"
    })
    .then(resp => resp.json())
}

const deleteButtonFunction = (quote) => {
    fetchDelete(quote)
    .then(listQuotes)
}
const addingQuote = (event) => {
    event.preventDefault()
    const author = event.target.author.value
    const quote = event.target.newquote.value
    fetchNewQuote(quote, author)
    .then(listQuotes)
}
newQuoteForm.addEventListener("submit", addingQuote)

const fetchNewQuote = (q, au) => {
    return fetch("http://localhost:3000/quotes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json" 
        },
        body: JSON.stringify({
            quote: q,
            author: au
        })
    })
}

