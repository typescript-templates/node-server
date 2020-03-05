import express from "express";
import { NodeServer } from "./NodeServer";
import { IAppRouter } from "./IAppRouter";

type Constructor<T extends {} = {}> = new (...args: any[])=> T;

export async function StartServer<T extends NodeServer>(factory: Constructor<T>, routes: IAppRouter[], port: number): Promise<T>;
export async function StartServer<T extends NodeServer>(instance: T, routes: IAppRouter[], port: number): Promise<T>;
export async function StartServer<T extends NodeServer>(factoryOrInstance: Constructor<T> | T, routes: IAppRouter[], port: number): Promise<T> {
  const server = factoryOrInstance instanceof NodeServer ? factoryOrInstance : new factoryOrInstance();
  await server.initialize(express());
  server.assignRoutes(routes);
  server.start(port);
  return server;
}