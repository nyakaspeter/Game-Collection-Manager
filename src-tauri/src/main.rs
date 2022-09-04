
#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use tauri::Manager;
use tauri_plugin_store::PluginBuilder;
use std::process::Command;

#[tauri::command]
async fn show_main_window(window: tauri::Window) {
  window.get_window("main").unwrap().show().unwrap();
}

#[tauri::command]
async fn exec_command(process: String, args: Vec<String>) {
  Command::new(process)
    .args(args)
    .spawn()
    .unwrap();
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![show_main_window, exec_command])
    .plugin(PluginBuilder::default().build())
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
