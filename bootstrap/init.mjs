console.log(`In ${window.location.href} starting script: ${import.meta.url}`);
console.log("This is init.mjs, located at https://koiosonline.github.io/lib/bootstrap/init.mjs")


/*
<script type="module"src="https://koiosonline.github.io/lib/bootstrap/init.mjs"><script>
    let url = new URL(document.location)
    url.host="ipfs.io"
    url.pathname="/ipfs/QmbWRaKQm7pKrmbbEnsAxBqs9vn6RJEyiHKS8JkxFj1Eki";
    if (!url.searchParams.get('orghostname'))  url.searchParams.append('orghostname', url.hostname);       
    if (!url.searchParams.get('orgpathname'))  url.searchParams.append('orgpathname', url.pathname);        
    console.log(location.href)
    console.log(url)
    
    var dest=url.toString()
    console.log(dest)
    location.href = dest;
</script>
*/
