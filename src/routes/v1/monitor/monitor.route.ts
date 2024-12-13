import { Router } from 'express';
import { auth } from '../../../middleware/auth';
import { MonitorController } from '../../../controllers/v1/monitor/Monitor.controller';
import { verifyFeatureAccess } from '../../../middleware/verifyFeatureAccess';
import { trackUsage } from '../../../middleware/trackUsage';

const router = Router();
const monitorController = new MonitorController();


router.route('/monitors')
    .get(auth,  trackUsage('getMonitors'), monitorController.getMonitors)
    .post(auth,  trackUsage('createMonitor'), monitorController.createMonitor);


router.route('/monitors/:id')
    .put(auth,  trackUsage('updateMonitor'), monitorController.updateMonitor)
    .delete(auth,  trackUsage('deleteMonitor'), monitorController.deleteMonitor);


router.route('/monitors/:id/suspend')
    .post(auth,  trackUsage('suspendMonitoring'), monitorController.suspendMonitoring);


router.route('/monitors/:id/resume')
    .post(auth,  trackUsage('resumeMonitoring'), monitorController.resumeMonitoring);

export default router;