// import Keycloak from 'keycloak-js'
import {KeycloakService} from "./service/keycloak.service";
const keycloakConfig = {
    url: 'https://admin.energiegemeinschaft.xyz/auth/',
    realm: 'VFEEG',
    clientId: 'eegfaktura'
}
// const keycloak = new Keycloak(keycloakConfig);
// export default keycloak

export const authKeycloak = new KeycloakService({
    authServerUrl: keycloakConfig.url,
    clientSecret: 'LxUXJLXP2Ra57y4RcIzXPYgNHvJF7H1j',
    clientId: keycloakConfig.clientId,
    realm: keycloakConfig.realm}
);