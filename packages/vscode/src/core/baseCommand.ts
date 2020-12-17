import * as vscode from "vscode";

export default abstract class BaseCommand {
  protected _context: vscode.ExtensionContext;
  abstract get name(): string;
  abstract method(...args: any[]): any;
}
