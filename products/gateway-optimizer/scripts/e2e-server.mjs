import{rmSync}from'node:fs';rmSync('data-e2e',{recursive:true,force:true});await import('../dist/apps/core-api/main.js');
