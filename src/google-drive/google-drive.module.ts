import { Module } from '@nestjs/common';
import { GoogleDriveService } from './google-drive.service';
import { GoogleDriveTool } from './google-drive.tool';

@Module({
  providers: [GoogleDriveService, GoogleDriveTool],
  exports: [GoogleDriveTool],
})
export class GoogleDriveModule {}
