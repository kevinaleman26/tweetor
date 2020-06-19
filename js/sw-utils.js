

function actualizaCacheDinamico(DYNAMIC_CACHE, req, res) {

    if(res.ok){
        caches.open(DYNAMIC_CACHE)
        .then(cache =>{
            cache.put(req,res.clone());
            return res.clone();
        });
    } else {
        return res;
    }

}