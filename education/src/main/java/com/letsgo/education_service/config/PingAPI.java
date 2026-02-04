package com.letsgo.education_service.config;

import java.io.IOException;
import java.net.InetAddress;
import java.net.URI;

import org.springframework.beans.factory.annotation.Value;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;


import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

@Slf4j
@Component
public class PingAPI {

    private  volatile boolean pingResponse;
    private  String hostname;

    public PingAPI(@Value("${spring.application.ping.host}") String hostname){
      log.info("========== CONSTRUCTEUR PingAPI APPELÉ ==========");
        log.info("URL reçue: {}", hostname);

        try {

          URI uri =  new URI(hostname);
          this.hostname = uri.getHost();
          
        } catch (Exception e) {
          System.out.println("Erreur lors de l'extraction "+ hostname+ e);
          throw new IllegalArgumentException("URL invalide: " + hostname, e);
        }

        

    }

  
    public static Mono<Boolean> pingHost(String hostname) {
        

      return Mono.fromCallable( () ->{ 

         try {
                InetAddress address = InetAddress.getByName(hostname);
                return address.isReachable(5000);
            } catch (IOException e) {
                return false;
          }
        
        }

      ).subscribeOn(Schedulers.boundedElastic());
           
    
    }

   @Scheduled(fixedRateString = "1800000",initialDelay = 0)   
   public  void SchedulePing() {
   

    PingAPI.pingHost(hostname)
                  .doOnSuccess((Reachable) ->{

                    if (Reachable){ this.pingResponse = true;}else{this.pingResponse = false;}
                  }).doOnSuccess(Reachable -> log.info("=======hostname======{}" ,Reachable))
                  .subscribe()
                  ;
     
    }

    public boolean getPingResponse(){
      return this.pingResponse;
    }
    
}
