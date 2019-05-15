declare module 'reacting-squirrel/server' {

    import * as http from 'http';
    import * as net from 'net';
    import * as express from 'express';
    import { Component } from 'react';
    import HttpSmartError from 'http-smart-error';
    import { ServerOptions as SocketServerOptions } from 'socket.io';

    export type HttpMethod = 'get' | 'post' | 'put' | 'delete';

    export interface IRequest<S extends Session = Session> extends express.Request {
        session: S;
    }

    export interface IResponse extends express.Response { }

    interface IAppConfig {
        /** Port on which the app listens. 
         * @default 8080 
         */
        port?: number;
        /** 
         * Relative path to the static directory for the express app. 
         * @default './public'
         */
        staticDir?: string;
        /** 
         * Flag of the dev status of the app. 
         * @default false
         */
        dev?: boolean;
        /** 
         * Name of the directory where the javascript is located in the staticDir.
         * @default 'js'
         */
        jsDir?: string;
        /**
         * Name of the bundle file.
         * @default 'bundle.js'
         */
        filename?: string;
        /**
         * Relative path to the app directory.
         * @default './app'
         */
        appDir?: string;
        /**
         * Relative path to the entry file.
         * @default null
         */
        entryFile?: string;
        /**
         * React component width default html code.
         * @default typeof Layout
         */
        layoutComponent?: typeof Layout;
        /**
         * Secret which is used to sign cookies.
         * @default '[random generated string]'
         */
        cookieSecret?: string;
        /**
         * List of scripts loaded in the base html.
         * @default []
         */
        scripts?: Array<string>;
        /**
         * List of styles loaded in the base html.
         * @default []
         */
        styles?: Array<string>;
        /**
         * Class of the session.
         * @default typeof Session
         */
        session?: typeof Session;
        /**
         * Maximal size of one socket message.
         * @default 104857600
         */
        socketMessageMaxSize?: number;
        /**
         * Auth function called before the route execution.
         * @param session Jebka
         * @default (session, next) => next()
         */
        auth?: (session: Session, next: (err?: any) => void) => void;
        /**
         * Function to handle errors in the route execution.
         * @default (err, req, res, next) => next()
         */
        errorHandler?: <S extends Session = Session>(err: any, req: IRequest<S>, res: IResponse, next: (err?: any) => void) => void;
        /**
         * Indicates if the bundle is loaded relatively in the output html.
         * @default false
         */
        bundlePathRelative?: boolean;
        /**
         * Function to handle webpack progress.
         * @default null
         */
        onWebpackProgress?: (percents: number, message: string) => void;
        /**
         * Custom webpack config.
         * @default {}
         */
        webpack?: any;
        /**
         * Custom socketIO config.
         * @default {}
         */
        socketIO?: SocketServerOptions;
    }

    interface ISocketEvent<S extends Session = Session> {
        event: string;
        listener: (socket: Socket<S>, data: any, next?: (err?: any, data?: any) => void) => void | Promise<any>;
    }

    interface ILayoutPropsInitialData {
        user: any;
        dev: boolean;
        timestamp: number;
    }

    export interface ILayoutProps<T = {}> {
        title: string;
        initialData: ILayoutPropsInitialData & T;
        /** @deprecated */
        user?: any;
        scripts?: Array<string>;
        styles?: Array<string>;
        version: string;
        bundle: string;
        charSet?: string;
        lang?: string;
    }

    export class Socket<S extends Session = Session> {

        static add(socket: net.Socket, events: Array<ISocketEvent>, maxMessageSize: number): void;

        static broadcast(event: string, data: any, filter: (socket: Socket) => boolean): void;

        static itereateSockets(iterator: (socket: Socket) => void): void;

        static on<S extends Session = Session>(event: 'connection' | 'error' | 'disconnect', listener: (socket: Socket<S>) => void): void;
        static on<S extends Session = Session>(event: 'connection' | 'error' | 'disconnect', listener: (socket: Socket<S>, ...args: Array<any>) => void): void;

        constructor(socket: net.Socket);

        emit(event: string, data: any): void;

        on(event: string, listener: (data?: any) => void): void;

        broadcast(event: string, data: any): void;
        broadcast(event: string, data: any, includeSelf: boolean): void;
        broadcast(event: string, data: any, includeSelf: boolean, filter: (socket: Socket) => boolean): void;

        getSession(): S;
    }

    export class Session {

        static genereateId(): string;

        id: string;

        constructor(id: string);

        setUser(user: any): void;

        getUser(): any;
    }

    export class Layout<P = ILayoutProps> extends Component<P> {

        renderContainer(): JSX.Element;

        renderLoader(): JSX.Element;
    }

    export class SocketClass<S extends Session = Session> {

        getEvents(): Array<ISocketEvent<S>>;
        broadcast(event: string, data: any): void;
        broadcast(event: string, data: any, includeSelf: boolean): void;
        broadcast(event: string, data: any, includeSelf: boolean, filter: (socket: Socket) => boolean): void;

        setSocket(socket: Socket): void;

        getSession(): S;

        getUser(): any;
    }

    export { HttpSmartError as HttpError };

    export namespace Utils {
        /**
         * Registers socket classes to the server app.
         * 
         * @param app Server instance.
         * @param dir Path to the directory with socket classes.
         */
        export function registerSocketClassDir(app: Server, dir: string): void;
        /**
         * Registers routes to the server app.
         * 
         * @param app Server instance.
         * @param routes List of routes to register.
         */
        export function registerRoutes(
            app: net.Server,
            routes: Array<{
                method?: HttpMethod;
                route: string;
                component: string;
                title: string;
                requireAuth?: boolean;
            }>
        ): void;
        /**
         * Registers components to the server app.
         * 
         * @param app Server instance.
         * @param components List of components to register.
         */
        export function registerComponents(app: Server, components: Array<{ id: string, component: string }>): void;
    }

    export default class Server {

        port: number;
        staticDir: string;
        staticDirAbsolute: string;
        dev: boolean;
        path: string;
        bundlePath: string;
        bundlePathAbsolute: string;
        appDir: string;
        appDirAbsolute: string;
        Layout: JSX.Element;
        Session: typeof Session;

        constructor(config?: IAppConfig);

        getServer(): http.Server;
        getApp(): express.Application;

        getSocketEvents(): Array<ISocketEvent>;

        getSocketClasses(): Array<SocketClass>;

        auth(session: Session, next: (err?: any) => void): void;

        get(route: string, contentComponent: string, title: string): this;
        get(route: string, contentComponent: string, title: string, requireAuth: boolean): this;
        get(route: string, contentComponent: string, title: string, requireAuth: boolean, callback: Function): this;

        registerRoute(method: 'get' | 'post' | 'put' | 'delete', route: string, contentComponent: string, title: string): this;
        registerRoute(method: 'get' | 'post' | 'put' | 'delete', route: string, contentComponent: string, title: string, requireAuth: boolean): this;
        registerRoute(method: 'get' | 'post' | 'put' | 'delete', route: string, contentComponent: string, title: string, requireAuth: boolean, callback: Function): this;

        registerSocketClass(cls: typeof SocketClass): this;

        registerSocketClass(cls: new () => SocketClass<Session>): this;

        registerSocketEvent(event: string, listener: ISocketEvent['listener']): this;

        registerComponent(componentPath: string, elementId: string): this;

        start(cb?: (err?: any) => void): void;
    }
}