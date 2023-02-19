install.packages(c("readr", "dplyr"))
library(dplyr)
library(readr)


annee <-  seq(from = 1996, to = 2022)
file <- paste("donnees/nivo.",as.character(annee),"02.csv",sep = "", collapse=NULL)

station <-  read.csv("donnees/postesNivo.csv")

X <- station



for (i in 1:length(file)) {
  
  x = read_csv2(file[i])
  as.data.frame(x)
  
  x <- x %>% 
    mutate_at(c("ht_neige","ssfrai", "numer_sta"), as.numeric) %>% 
    select(numer_sta,ht_neige,ssfrai) %>% 
    group_by(numer_sta) %>% 
    summarise(ht_neige = mean(ht_neige,na.rm=TRUE),ssfrai = mean(ssfrai,na.rm=TRUE))
    
  h_annee <- paste("h",as.character(annee[i]),sep="")
  hf_annee <- paste("hf",as.character(annee[i]),sep="")
  
  x <- x %>% 
    rename(!!h_annee := ht_neige, !!hf_annee := ssfrai)
  
  #X <- X %>% 
    #left_join(X,x, by=(X$ID=x$numer_sta))
  X <- merge(x=X,y=x, by.x="ID", 
               by.y="numer_sta")
}


write.csv(X,"donnees/aggreg.csv", row.names=TRUE)
