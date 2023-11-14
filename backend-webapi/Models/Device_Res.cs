using Reservation.Models;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema; //Need to update models if database has changed

namespace ReservationApp.Models
{
    public class DeviceRes
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        
        public long NetID { get; set; }
        public int DeviceTag { get; set; }

        [Required]
        public DateTime RequestDate { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        public virtual User User { get; set; }
       
        public virtual Device Device { get; set; }
    }
}
