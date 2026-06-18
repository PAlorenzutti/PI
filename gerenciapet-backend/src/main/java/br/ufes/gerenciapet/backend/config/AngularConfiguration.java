package br.ufes.gerenciapet.backend.config;

import java.io.IOException;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.web.filter.ForwardedHeaderFilter;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

/**
 * Configuração responsável por servir os arquivos estáticos do frontend Angular.
 */
@Configuration
public class AngularConfiguration implements WebMvcConfigurer {

    /**
     * Configura a resolução de recursos estáticos e redireciona rotas do Angular
     * para o arquivo {@code index.html}.
     *
     * @param registry registro de manipuladores de recursos do Spring MVC.
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/**/*")
                .addResourceLocations("classpath:/static/")
                .resourceChain(true)
                .addResolver(new PathResourceResolver() {
                    /**
                     * Resolve recursos estáticos e usa o {@code index.html} como
                     * fallback para rotas do frontend.
                     *
                     * @param resourcePath caminho do recurso solicitado.
                     * @param location local base dos recursos estáticos.
                     * @return recurso solicitado ou o arquivo principal do Angular.
                     * @throws IOException quando o recurso não puder ser lido.
                     */
                    @Override
                    protected Resource getResource(String resourcePath,
                                                   Resource location) throws IOException {
                        Resource requestedResource = location.createRelative(resourcePath);

                        return requestedResource.exists() && requestedResource.isReadable() ? requestedResource
                                : new ClassPathResource("/static/index.html");
                    }
                });
    }

    /**
     * Registra o filtro que interpreta cabeçalhos encaminhados por proxies.
     *
     * @return bean de registro do {@link ForwardedHeaderFilter}.
     */
    @Bean
    public FilterRegistrationBean<ForwardedHeaderFilter> forwardedHeaderFilter() {
        FilterRegistrationBean<ForwardedHeaderFilter> bean = new FilterRegistrationBean<>();
        bean.setFilter(new ForwardedHeaderFilter());
        return bean;
    }

}
