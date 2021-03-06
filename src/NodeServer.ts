import { IRoute, RequestHandler, ErrorRequestHandler } from "express";
import { HttpVerbs } from "@dotup/dotup-ts-types";
import { IAppRouter } from "./IAppRouter";
import { ServerMethods } from "./ServerMethods";
import compression from "compression";  // compresses requests
import bodyParser from "body-parser";
import lusca from "lusca";
import session from "express-session";
import { DefaultErrorHandler } from "./errors/DefaultErrorHandler";

export type SessionStoreFactory = () => session.Store | session.MemoryStore | undefined;

export class NodeServer {
  private server: ServerMethods;
  get = (url: string, ...requestHandler: RequestHandler[]): IRoute => {
    return this.addRoute("get", url, ...requestHandler);
  }

  post = (url: string, ...requestHandler: RequestHandler[]): IRoute => {
    return this.addRoute("post", url, ...requestHandler);
  }

  del = (url: string, ...requestHandler: RequestHandler[]): IRoute => {
    return this.addRoute("delete", url, ...requestHandler);
  }

  delete = (url: string, ...requestHandler: RequestHandler[]): IRoute => {
    return this.addRoute("delete", url, ...requestHandler);
  }

  put = (url: string, ...requestHandler: RequestHandler[]): IRoute => {
    return this.addRoute("put", url, ...requestHandler);
  }

  head = (url: string, ...requestHandler: RequestHandler[]): IRoute => {
    return this.addRoute("head", url, ...requestHandler);
  }

  opts = (url: string, ...requestHandler: RequestHandler[]): IRoute => {
    return this.addRoute("options", url, ...requestHandler);
  }

  options = (url: string, ...requestHandler: RequestHandler[]): IRoute => {
    return this.addRoute("options", url, ...requestHandler);
  }

  patch = (url: string, ...requestHandler: RequestHandler[]): IRoute => {
    return this.addRoute("patch", url, ...requestHandler);
  }

  // trans = async (url: string, ...requestHandler: RequestHandler[]): IRoute => {
  //   this.addRoute("trans", url, ...requestHandler);
  // }
  use = (...requestHandler: (RequestHandler | ErrorRequestHandler)[]): void => {
    this.server.use(...requestHandler);
  }

  async initialize(server: ServerMethods, sessionStoreFactory?: SessionStoreFactory, sessionSecret?: string): Promise<void> {
    this.server = server;

    this.use(compression());
    this.use(bodyParser.json());
    this.use(bodyParser.urlencoded({ extended: true }));
    this.use(lusca.xframe("SAMEORIGIN"));
    this.use(lusca.xssProtection(true));

    if(sessionStoreFactory){
      const sercret = sessionSecret ? sessionSecret: "dlif7yccv876ZZpommZffS56e";
      this.ConfigureSession(sessionStoreFactory, sercret);
    }

    // for (const route of routes) {
    //   route.initialize();
    //   if (route.url) {
    //     server.use(route.url, route.Router);
    //   } else {
    //     server.use(route.Router);
    //   }
    // }

  }

  assignRoutes(routes: IAppRouter[]): void {
    for (const route of routes) {
      route.initialize();
      if (route.url) {
        this.server.use(route.url, route.Router);
      } else {
        this.server.use(route.Router);
      }
    }

  }

  start = (port: number): void => {
    this.server.listen(port, () => console.log(`Server is up & running on port http://localhost:${port}`));
  }

  private addRoute(method: HttpVerbs, url: string, ...requestHandler: RequestHandler[]): any {
    console.log(`Added route ${method.toUpperCase()} ${url}`);
    return this.server[method](url, ...requestHandler);
  }

  private ConfigureSession = (sessionStoreFactory: () => session.Store | session.MemoryStore | undefined, sessionSecret: string): void => {
    this.use(session({
      resave: true,
      saveUninitialized: true,
      secret: sessionSecret,
      store: sessionStoreFactory()
    }));
  }
}
