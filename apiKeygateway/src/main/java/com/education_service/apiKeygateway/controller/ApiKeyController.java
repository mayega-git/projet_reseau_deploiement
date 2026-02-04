package com.education_service.apiKeygateway.controller;

import java.net.URI;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.MultiValueMap;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebSession;

import com.education_service.apiKeygateway.enums.Module;
import com.education_service.apiKeygateway.dto.RequestTokenDto;
import com.education_service.apiKeygateway.enums.Scope;
import com.education_service.apiKeygateway.enums.Status;
import com.education_service.apiKeygateway.service.RequestTokenService;
import com.education_service.apiKeygateway.utils.AlertMessage;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;

@Controller
@RequiredArgsConstructor
@RequestMapping
public class ApiKeyController {

    private final ApiKeyRestController apiKeyRestController;

    private final RequestTokenService requestTokenService;

    @GetMapping("/admin")
    public Mono<String> showAdminPage(
            @RequestParam(name="status" ,required = false, defaultValue = "PENDING") String status,
            Model model) {
        System.out.println("/admin page");
        return requestTokenService.findAll()
                .collectList()
                .map(requests -> {
                    model.addAttribute("requests", requests);
                    model.addAttribute("currentStatus", status);
                    return "adminValidation";
                });
    }

    @PostMapping("/admin/request/validate/{id}")
    public Mono<String> updateRequestStatusValidate(Model model,
            @PathVariable("id") String id) {

        return requestTokenService
                .updateRequestStatusValidate(UUID.fromString(id), Status.VALIDATE)
                .thenReturn("redirect:/admin?msg=success")
                .onErrorResume(e -> {
                    System.err.println("❌ Erreur updateRequestStatus: " + e.getMessage());
                    return Mono.just("redirect:/admin?msg=error");
                });
    }

    @PostMapping("/admin/request/reject/{id}")
    public Mono<String> updateRequestStatusReject(Model model,
            @PathVariable("id") String id) {

        return requestTokenService
                .updateRequestStatusReject(UUID.fromString(id), Status.REJECT)
                .thenReturn("redirect:/admin?msg=success")
                .onErrorResume(e -> {
                    e.printStackTrace();
                    System.err.println(" Erreur updateRequestStatus: " + e.getMessage());
                    return Mono.just("redirect:/admin?msg=error");
                });
    }

    @GetMapping("/request")
    public String showRequestForm(Model model, WebSession session) {

        if (!model.containsAttribute("requestTokenDto")) {
            RequestTokenDto dto = new RequestTokenDto();
            dto.setServiceNames(new HashMap<>());
            model.addAttribute("requestTokenDto", dto);
        }

        // Message flash (si présent)
        if (session.getAttributes().containsKey("message")) {
            model.addAttribute("message", session.getAttributes().remove("message"));
        }

        return "requestToken";
    }

    @PostMapping("/request")
    public Mono<String> submitRequest(
            @Valid @ModelAttribute RequestTokenDto dto,
            BindingResult bindingResult,
            ServerWebExchange exchange) {

        return exchange.getSession().flatMap(session -> {

            if (bindingResult.hasErrors()) {
                session.getAttributes().put(
                        "message",
                        new AlertMessage("error", "Veuillez corriger les erreurs du formulaire"));
                return Mono.just("redirect:/request");
            }

            // Construction contrôlée des modules/scopes
            return exchange.getFormData()
                    .flatMap(formData -> {

                        Map<Module, Scope> serviceNames = buildServiceNamesMap(formData);

                        if (serviceNames.isEmpty()) {
                            session.getAttributes().put(
                                    "message",
                                    new AlertMessage("error", "Vous devez sélectionner au moins un module"));
                            return Mono.just("redirect:/request");
                        }

                        dto.setServiceNames(serviceNames);

                        return requestTokenService.saveRequestToken(dto)
                                .map(savedToken -> {
                                    session.getAttributes().put(
                                            "message",
                                            new AlertMessage(
                                                    "success",
                                                    "Requête enregistrée avec succès"));
                                    return "redirect:/request";
                                })
                                .onErrorResume(ex -> {
                                    session.getAttributes().put(
                                            "message",
                                            new AlertMessage(
                                                    "error",
                                                    "Échec de l'enregistrement : " + ex.getMessage()));
                                    return Mono.just("redirect:/request");
                                });

                    })
                    .onErrorResume(e -> {
                        session.getAttributes().put(
                                "message",
                                new AlertMessage("error", "Erreur système : " + e.getMessage()));
                        return Mono.just("redirect:/request");
                    });
        });
    }

    private Map<Module, Scope> buildServiceNamesMap(MultiValueMap<String, String> formData) {

        Map<Module, Scope> result = new HashMap<>();

        formData.forEach((key, values) -> {
            if (key.startsWith("module_") && !values.isEmpty()) {
                String index = key.substring("module_".length());
                List<String> scopeList = formData.get("scope_" + index);

                if (scopeList != null && !scopeList.isEmpty()) {
                    Module module = Module.valueOf(values.get(0));
                    Scope scope = Scope.valueOf(scopeList.get(0));
                    result.put(module, scope);
                }
            }
        });

        return result;
    }

}