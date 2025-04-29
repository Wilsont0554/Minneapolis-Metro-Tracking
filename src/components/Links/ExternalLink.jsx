export default function main(props){    

    const {text, link, download} = props

    return(
        <>
            <a href = {link} target="_blank" download = {download} className = "link">{text}</a>
        </>
    )
}