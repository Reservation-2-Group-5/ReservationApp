using Microsoft.AspNetCore.Mvc;
using ReservationApp.Models;
using ReservationApp.Services;
using System;
using System.Threading.Tasks; //Should be good?

[Route("api/v1/device-res")]
[ApiController]
public class DeviceResController : ControllerBase
{
    private readonly IDeviceResService _deviceResService;
    private readonly IDeviceService _deviceService;
    private readonly IUserService _userService;

    public DeviceResController(
        IDeviceResService deviceResService,
        IDeviceService deviceService,
        IUserService userService)
    {
        _deviceResService = deviceResService;
        _deviceService = deviceService;
        _userService = userService;
    }

    // GET api/v1/device-res
    [HttpGet("")]
    public async Task<IActionResult> GetAllDeviceReservations()
    {
        try
        {
            var deviceReservations = await _deviceResService.GetAllDeviceReservationsAsync();
            return Ok(deviceReservations);
        }
        catch (Exception ex)
        {
           
            return StatusCode(500, ex.Message);
        }
    }

    // POST api/v1/device-res
    [HttpPost("")]
    public async Task<IActionResult> SubmitDeviceReservation([FromBody] DeviceRes deviceRes)
    {
        try
        {
            var submittedDeviceRes = await _deviceResService.CreateDeviceReservationAsync(deviceRes);
            var user = await _userService.GetUserByIdAsync(deviceRes.NetID);

            
            var device = await _deviceService.GetDeviceByTagAsync(deviceRes.Tag);
            device.Available = false;
            
            device.Assigned_To = user.Name;

            await _deviceService.UpdateDeviceAsync(device);

            return Ok(submittedDeviceRes);
        }
        catch (Exception ex)
        {
           
            return StatusCode(500, ex.Message);
        }
    }

    // PUT api/v1/room-res/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateRoomReservationStatus(int id, [FromBody] string status)
    {
        try
        {
            var reservation = await _deviceResService.GetDeviceReservationByIdAsync(id);

            if (status == "approved")
            {
              
                await _deviceResService.DeleteDeviceReservationAsync(id);
            }
            else if (status == "denied")
            {
                
                await _deviceResService.DeleteDeviceReservationAsync(id);
                var device = await _deviceService.GetDeviceByTagAsync(reservation.Tag);
                device.Available = true;
                
                device.Assigned_To = null;

                await _deviceService.UpdateDeviceAsync(device);
            }

            return Ok(new { message = "Reservation processed successfully." });
        }
        catch (Exception ex)
        {
            
            return StatusCode(500, ex.Message);
        }
    }
}
